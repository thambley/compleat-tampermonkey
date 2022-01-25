// ==UserScript==
// @name         Add Process Name To New Log
// @namespace    https://support.concurcompleat.com/Logs
// @updateURL    https://github.com/thambley/compleat-tampermonkey/raw/main/Download%20New%20Log.user.js
// @version      0.2
// @description  Add Process Name To Selected Log Snippets
// @author       thambley@tlcorporate.com
// @match        https://support.concurcompleat.com/Logs*
// @match        https://support.concurcompleat.com/logs*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
  'use strict';

  var logs = [];
  var selectedLogs = [];
  var currentHref = document.location.href;
  var old_fetch = unsafeWindow.fetch;

  function jsonHandler(json) {
      if (json.body != null) {
          console.log(json.id);
          const found = logs.find(log => log.id == json.id);
          if (found == null) {
              logs.push(json);
              console.log('logs count: ' + logs.length);
              populateSelectedLogs(currentHref);
              updateProcessNames();
          }
      }
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
                  const found = logs.find(log => log.id == sid);
                  if (found != null) {
                      selectedLogs.push(found);
                  }
              }
          }
      }
      console.log('selected log count: ' + selectedLogs.length);
  }


  function getWorkflowName(content) {
      var processRegex = new RegExp('(Workflow:|Name:) "([^"]+)"', 'g');
      var processMatches = [...content.matchAll(processRegex)];
      var processMatch = processMatches.find((element) => { return (element[2] !== 'Determine PNR Type' && element[2] !== 'Determine PNR Type - IC Offline (ALTOUR)' && element[2] !== 'Determine PNR Type - IC Online (ALTOUR)') });
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
        processNameNode = document.createElement("span");
        processNameNode.id = processNameId;
        processNameNode.classList.add("MuiTypography-root");
        processNameNode.classList.add("MuiFormControlLabel-label");
        processNameNode.classList.add("MuiTypography-body1");

        currentNode.appendChild(processNameNode);
      }
      processNameNode.innerText = processName;
    }
  }

  function updateProcessNames() {
    var workflowNames = selectedLogs.map(log => getWorkflowName(log.body));
    var checkBoxes = Array.from(document.querySelectorAll("input[type=checkbox]"));
    var checkedSnippets = checkBoxes.filter(box => box.name.startsWith("checkSnippet") && box.checked);
    if (workflowNames.length == checkedSnippets.length) {
      for (var i = 0; i < workflowNames.length; i++)
      {
        updateProcessName(checkedSnippets[i], workflowNames[i]);
      }
    } else {
      console.log('workflow name count: ' + workflowNames.length.toString() + '. checked box count: ' + checkedSnippets.length.toString());
    }
  }

  // clone the response to be handled by the original handler
  function responseHandler(response) {
      // console.log(response.body);
      var clonedResponse = response.clone();
      response.json().then(jsonHandler);
      return clonedResponse;
  }

  // replace the fetch event to allow the script to get log information
  unsafeWindow.fetch = function(resource, init) {
      console.log('request resource: ' + resource);
      console.log(init);
      // init.headers.contentType = "application/json; charset=utf-8";
      return old_fetch(resource, init).then(responseHandler);
  }

  // https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
  var bodyList = document.querySelector("body")

  var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          if (currentHref != document.location.href) {
              currentHref = document.location.href;
              /* Changed ! your code here */
              console.log(`currentHref: ${currentHref}`);
              populateSelectedLogs(currentHref);
              updateProcessNames();
          }
      });
  });

  var config = {
      childList: true,
      subtree: true
  };

  observer.observe(bodyList, config);
})();