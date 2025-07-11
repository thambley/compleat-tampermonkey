// ==UserScript==
// @name         Add Process Name To New Log
// @namespace    https://support.concurcompleat.com/Logs
// @downloadURL  https://github.com/thambley/compleat-tampermonkey/raw/main/Add%20Process%20Name%20to%20New%20Log.user.js
// @updateURL    https://github.com/thambley/compleat-tampermonkey/raw/main/Add%20Process%20Name%20to%20New%20Log.user.js
// @version      0.13
// @description  Add Process Name To Selected Log Snippets
// @author       thambley@tlcorporate.com
// @match        https://support.concurcompleat.com/Logs*
// @match        https://support.concurcompleat.com/logs*
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  var logs = [];
  var selectedLogs = [];

  function findLogById(logId) {
    return logs.find(log => log.id == logId);
  }

  function jsonHandler(json) {
    if (json.body != null) {
      const found = findLogById(json.id);
      if (found == null) {
        logs.push(json);
      }
    }
    populateSelectedLogs(currentHref);
    setTimeout(updateProcessNames, 500);
  }

  function populateSelectedLogs(href) {
    var queryParts = href.split('?');
    selectedLogs = [];
    if (queryParts.length > 1) {
      var query = queryParts[1].split('&');
      var parameters = { id: '', sid: [] };
      for (var i = 0; i < query.length; i++) {
        var parameterParts = query[i].split('=');
        if (parameterParts[0] == 'id') {
          parameters.id = parameterParts[1];
        } else if (parameterParts[0] == 'sid') {
          var sid = parameterParts[1];
          parameters.sid.push(sid);
          const found = findLogById(sid);
          if (found != null) {
            selectedLogs.push(found);
          }
        }
      }
    }
  }


  function getWorkflowName(content) {
    var processRegex = new RegExp('(Workflow:|Name:) "([^"]+)"', 'g');
    var processMatches = [...content.matchAll(processRegex)];
    var processMatch = processMatches.find((wfElement) => { return (wfElement[1] == 'Workflow:') }) || processMatches.find((element) => { return (element[2] !== 'Determine PNR Type' && element[2] !== 'Determine PNR Type - IC Offline (ALTOUR)' && element[2] !== 'Determine PNR Type - IC Online (ALTOUR)') });
    var process = processMatch ? processMatch[2] : 'Unknown';

    return process;
  }

  function updateProcessName(checkbox, processName) {
    // get the container
    var currentNode = checkbox;
    var checkboxName = checkbox.name;
    var processNameId = `${checkboxName}_processName`;
    while (currentNode.tagName != "LABEL" && currentNode != null) {
      currentNode = currentNode.parentNode;
    }
    if (currentNode != null) {
      var processNameNode = document.getElementById(processNameId);
      if (processNameNode == null) {
        var currentLabel = currentNode.querySelector("h6");
        processNameNode = document.createElement("span");
        processNameNode.id = processNameId;
        for (const labelClass of currentLabel.classList.values()) {
          processNameNode.classList.add(labelClass);
        }
        currentNode.children[currentNode.children.length - 1].appendChild(processNameNode);
      }
      processNameNode.innerText = processName;
    }
  }

  function updateProcessNames() {
    var workflowNames = selectedLogs.map(log => getWorkflowName(log.body));
    var checkBoxes = Array.from(document.querySelectorAll("input[type=checkbox]"));
    var checkedSnippets = checkBoxes.filter(box => box.name.startsWith("checkSnippet") && box.checked);
    if (workflowNames.length == checkedSnippets.length) {
      for (var i = 0; i < workflowNames.length; i++) {
        updateProcessName(checkedSnippets[i], workflowNames[i]);
      }
    } else {
      console.log('workflow name count: ' + workflowNames.length.toString() + '. checked box count: ' + checkedSnippets.length.toString());
    }
  }

  // clone the response to be handled by the original handler
  function responseHandler(response) {
    var clonedResponse = response.clone();
    response.json().then(jsonHandler);
    return clonedResponse;
  }

  if (document.location.hash != '#infoview') {
    // replace the fetch event to allow the script to get log information
    var old_fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (resource, init) {
      return old_fetch(resource, init).then(responseHandler);
    }

    // https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
    var currentHref = document.location.href;
    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (currentHref != document.location.href) {
          currentHref = document.location.href;
          populateSelectedLogs(currentHref);
          setTimeout(updateProcessNames, 500);
        }
      });
    });

    var config = {
      childList: true,
      subtree: true
    };

    observer.observe(bodyList, config);
  }
})();