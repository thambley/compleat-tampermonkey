// ==UserScript==
// @name         Add Process Name To Log
// @namespace    https://support.concurcompleat.com/Logs/Snippet/
// @updateURL    https://raw.githubusercontent.com/thambley/compleat-tampermonkey/main/Add%20Process%20Name%20to%20Log.js
// @version      0.4
// @description  Add Process Name To Log Snippet page
// @author       thambley@tlcorporate.com
// @match        https://support.concurcompleat.com/Logs/Snippet*
// @match        https://support.concurcompleat.com/logs/Snippet*
// @match        https://support.gdsx.com/logs/Snippet*
// @match        https://support.gdsx.com/Logs/Snippet*
// @grant        none
// ==/UserScript==

(function () {
  var logInfo = document.querySelector('.log-info');
  if (logInfo == null) {
    return;
  }
  var content = editor.getValue();
  var gds = content.includes('<PNRBFManagement') ? 'Apollo' : content.includes('DIR0DPN') ? 'Worldspan' : content.includes('SD000766') ? 'Sabre' : content.includes('http://xml.amadeus.com/') ? 'Amadeus' : 'Unknown';

  var processRegex = new RegExp('(Workflow:|Name:) "([^"]+)"', 'g');
  var processMatches = [...content.matchAll(processRegex)];
  var processMatch = processMatches.find((element) => { return (element[2] !== 'Determine PNR Type' && element[2] !== 'Determine PNR Type - IC Offline (ALTOUR)' && element[2] !== 'Determine PNR Type - IC Online (ALTOUR)') });

  var process = processMatch ? processMatch[2] : 'Unknown';

  var logInfoRow2 = document.createElement("div");
  logInfoRow2.classList.add("row");

  var spanGdsLabel = document.createElement("span");
  spanGdsLabel.classList.add("col-3");
  spanGdsLabel.classList.add("log-label");
  spanGdsLabel.classList.add("text-right");
  spanGdsLabel.innerText = "Gds:";

  logInfoRow2.appendChild(spanGdsLabel);

  var spanGdsValue = document.createElement("span");
  spanGdsValue.classList.add("col");
  spanGdsValue.classList.add("log-value");
  spanGdsValue.classList.add("text-left");
  spanGdsValue.innerText = gds;

  logInfoRow2.appendChild(spanGdsValue);

  var spanProcessLabel = document.createElement("span");
  spanProcessLabel.classList.add("col-3");
  spanProcessLabel.classList.add("log-label");
  spanProcessLabel.classList.add("text-right");
  spanProcessLabel.innerText = "Process:";

  logInfoRow2.appendChild(spanProcessLabel);

  var spanProcessValue = document.createElement("span");
  spanProcessValue.classList.add("col");
  spanProcessValue.classList.add("log-value");
  spanProcessValue.classList.add("text-left");
  spanProcessValue.innerText = process;

  logInfoRow2.appendChild(spanProcessValue);

  logInfo.appendChild(logInfoRow2);

})();