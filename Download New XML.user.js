// ==UserScript==
// @name         Download New XML
// @namespace    https://support.concurcompleat.com/Logs
// @downloadURL  https://github.com/thambley/compleat-tampermonkey/raw/main/Download%20New%20XML.user.js
// @updateURL    https://github.com/thambley/compleat-tampermonkey/raw/main/Download%20New%20XML.user.js
// @version      0.4
// @description  Download selected xml
// @author       thambley@tlcorporate.com
// @match        https://support.concurcompleat.com/Logs*
// @match        https://support.concurcompleat.com/logs*
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  var locator = '';
  var logs = [];
  var selectedLogs = [];
  var currentHref = document.location.href;
  var old_fetch = unsafeWindow.fetch;

  function jsonHandler(json) {
    if (json.options != null) {
      locator = json.options.recordLocator;
    }
    if (json.body != null) {
      console.log(json.id);
      const found = logs.find(log => log.id == json.id);
      if (found == null) {
        logs.push(json);
        populateSelectedLogs(currentHref);
        updateDownloadXmlButton();
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

  function getContent() {
    if (selectedLogs.length == 0) {
      return null;
    } else {
      const fullContent = selectedLogs.map(log => log.body).join('\r\n');
      const startIndex = fullContent.indexOf('<pnr xmlns="http://gdsx.com/agencyDefault/PnrDataPush.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">');
      if (startIndex > 0) {
        const endIndex = fullContent.indexOf('</pnr>', startIndex);
        if (endIndex > 0) {
          return fullContent;
        }
      }
      return null;
    }
  }

  function getXml(content) {
    const startIndex = content.indexOf('<pnr xmlns="http://gdsx.com/agencyDefault/PnrDataPush.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">');
    if (startIndex > 0) {
      const endIndex = content.indexOf('</pnr>', startIndex);
      if (endIndex > 0) {
        return ('<?xml version="1.0" encoding="utf-8"?>\n' + content.substring(startIndex, endIndex + 6));
      }
    }
    return null;
  }

  function getRecordLocator() {
    const labels = Array.from(document.querySelectorAll('label'));
    const recordLocatorLabel = labels.find(el => el.textContent === 'Record Locator');
    return recordLocatorLabel.nextSibling.querySelector('input').value;
  }

  function getAgencyName() {
    return document.getElementById('agency-combo').value;
  }

  function getGds(content) {
    return content.includes('<PNRBFManagement') ? 'Apollo' : content.includes('DIR0DPN') ? 'Worldspan' : content.includes('SD000766') ? 'Sabre' : content.includes('http://xml.amadeus.com/') ? 'Amadeus' : 'Unknown';
  }

  function getFileDate(content) {
    var logDateMatches = content.match(new RegExp('([\\d]+)/([\\d]+)/([\\d]+) ([\\d]+):([\\d]+):([\\d]+)\\.([\\d]+)'));
    var make2Characters = function (str) { return ('0' + str).substring(str.length - 1) };
    var logDateText = '20' + logDateMatches[3] + '_' + make2Characters(logDateMatches[1]) + '_' + make2Characters(logDateMatches[2]) + '_' + make2Characters(logDateMatches[4]) + '_' + make2Characters(logDateMatches[5]) + '_' + logDateMatches[6];
    return logDateText;
  }

  function getWorkflowName(content) {
    var processRegex = new RegExp('(Workflow:|Name:) "([^"]+)"', 'g');
    var processMatches = [...content.matchAll(processRegex)];
    var processMatch = processMatches.find((element) => { return (element[2] !== 'Determine PNR Type' && element[2] !== 'Determine PNR Type - IC Offline (ALTOUR)' && element[2] !== 'Determine PNR Type - IC Online (ALTOUR)') });
    var process = processMatch ? processMatch[2] : 'Unknown';

    return process;
  }

  function getFilename(content) {
    if (content == null) {
      console.log('filename: null');
      return null;
    } else {
      var filenameParts = [getRecordLocator(), getAgencyName().replace(' ', ''), getGds(content), getFileDate(content), getWorkflowName(content)];
      return (filenameParts.join('-') + '.xml');
    }
  }

  function updateDownloadXmlButton() {
    const buttons = Array.from(document.querySelectorAll('button'));
    const snippetsButton = buttons.find(el => el.textContent === 'All Snippets' || el.textContent === 'First 15 Snippets');

    var downloadXmlButton = document.getElementById('DownloadXmlButton');

    if (downloadXmlButton == null) {
      const snippetsParent = snippetsButton.parentNode;
      const buttonContainer = snippetsParent.parentNode;

      const downloadDiv = document.createElement("div");
      downloadDiv.classList.add("MuiGrid-root");
      downloadDiv.classList.add("MuiGrid-item");

      downloadXmlButton = document.createElement("a");
      downloadXmlButton.id = "DownloadXmlButton";
      downloadXmlButton.classList.add("MuiButtonBase-root");
      downloadXmlButton.classList.add("MuiButton-root");
      downloadXmlButton.classList.add("MuiButton-contained");
      downloadXmlButton.classList.add("MuiButton-containedSizeSmall");
      downloadXmlButton.classList.add("MuiButton-sizeSmall");
      downloadDiv.appendChild(downloadXmlButton);

      var spanDownload = document.createElement("span");
      downloadXmlButton.classList.add("MuiButton-label");
      spanDownload.innerText = "XML";
      downloadXmlButton.appendChild(spanDownload);

      buttonContainer.appendChild(downloadDiv);
    }

    var content = getContent();
    var xml = getXml(content);
    if (xml != null) {
      if (downloadXmlButton.classList.contains('Mui-disabled')) {
        downloadXmlButton.classList.remove('Mui-disabled');
      }
      var file = new Blob([xml], { type: 'text/plain' });
      downloadXmlButton.href = URL.createObjectURL(file);
      downloadXmlButton.download = getFilename(content); //file name
    } else {
      if (!downloadXmlButton.classList.contains('Mui-disabled')) {
        downloadXmlButton.classList.add('Mui-disabled');
      }
    }
  }

  // clone the response to be handled by the original handler
  function responseHandler(response) {
    var clonedResponse = response.clone();
    response.json().then(jsonHandler);
    return clonedResponse;
  }

  // replace the fetch event to allow the script to get log information
  unsafeWindow.fetch = function (resource, init) {
    return old_fetch(resource, init).then(responseHandler);
  }

  // https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
  var bodyList = document.querySelector("body")

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (currentHref != document.location.href) {
        currentHref = document.location.href;
        populateSelectedLogs(currentHref);
        updateDownloadXmlButton();
      }
    });
  });

  var config = {
    childList: true,
    subtree: true
  };

  observer.observe(bodyList, config);
})();