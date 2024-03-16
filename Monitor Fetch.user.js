// ==UserScript==
// @name         Monitor fetch
// @namespace    https://support.concurcompleat.com/Logs
// @downloadURL  https://github.com/thambley/compleat-tampermonkey/raw/main/Monitor%20Fetch.user.js
// @updateURL    https://github.com/thambley/compleat-tampermonkey/raw/main/Monitor%20Fetch.user.js
// @version      0.3
// @description  Watch fetch requests and responses on compleat logs and output information to console log
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
    console.log(json);
    if (json.body != null) {
      console.log('log id: ' + json.id);
      console.log('locator: ' + json.name)
      const found = findLogById(json.id);
      if (found == null) {
        logs.push(json);
        populateSelectedLogs(currentHref);
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
          const found = findLogById(sid);
          if (found != null) {
            selectedLogs.push(found);
          }
        }
      }
    }
    console.log('selected log count: ' + selectedLogs.length);
  }

  // clone the response to be handled by the original handler
  function responseHandler(response) {
    // console.log(response.body);
    var clonedResponse = response.clone();
    response.json().then(jsonHandler);
    return clonedResponse;
  }

  // replace the fetch event to allow the script to get log information
  var old_fetch = unsafeWindow.fetch;
  unsafeWindow.fetch = function (resource, init) {
    console.log('request resource: ' + resource);
    console.log('init: ');
    console.log(init);
    return old_fetch(resource, init).then(responseHandler);
  }

  // https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
  var currentHref = document.location.href;
  var bodyList = document.querySelector("body")

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (currentHref != document.location.href) {
        currentHref = document.location.href;
        console.log(`currentHref: ${currentHref}`);
        populateSelectedLogs(currentHref);
      }
    });
  });

  var config = {
    childList: true,
    subtree: true
  };

  observer.observe(bodyList, config);
})();