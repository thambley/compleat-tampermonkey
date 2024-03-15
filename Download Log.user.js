// ==UserScript==
// @name         Download Log
// @namespace    https://support.concurcompleat.com/Logs/Snippet/
// @updateURL    https://github.com/thambley/compleat-tampermonkey/raw/main/Download%20Log.user.js
// @version      0.8
// @description  Download log text as a text file
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
  var rightColumn = document.querySelector(".col.text-right");
  var logInfoRow = logInfo.querySelector('.row');
  var logValues = Array.from(logInfoRow.querySelectorAll('.log-value')).map(x => x.innerText.replace(' ', '') || x.textContent.replace(' ', ''));
  var content = editor.getValue();
  var gds = content.includes('<PNRBFManagement') && content.includes('<OwningCRS>1G</OwningCRS>') ? 'Galileo' :
            content.includes('<PNRBFManagement') && content.includes('<OwningCRS>1V</OwningCRS>') ? 'Apollo' :
            content.includes('DIR0DPN') ? 'Worldspan' :
            content.includes('SD000766') ? 'Sabre' :
            content.includes('http://xml.amadeus.com/') ? 'Amadeus' :
            'Unknown';
  logValues.push(gds);
  // 4/25/19 13:09:43.199
  var logDateMatches = content.match(new RegExp('([\\d]+)/([\\d]+)/([\\d]+) ([\\d]+):([\\d]+):([\\d]+)\\.([\\d]+)'));
  var make2Characters = function (str) { return ('0' + str).substring(str.length - 1) };
  var logDateText = '20' + logDateMatches[3] + '_' + make2Characters(logDateMatches[1]) + '_' + make2Characters(logDateMatches[2]) + '_' + make2Characters(logDateMatches[4]) + '_' + make2Characters(logDateMatches[5]) + '_' + logDateMatches[6];
  logValues.push(logDateText);

  var processRegex = new RegExp('(Workflow:|Name:) "([^"]+)"', 'g');
  var processMatches = [...content.matchAll(processRegex)];
  var processMatch = processMatches.find((element) => { return (element[2] !== 'Determine PNR Type' && element[2] !== 'Determine PNR Type - IC Offline (ALTOUR)' && element[2] !== 'Determine PNR Type - IC Online (ALTOUR)') });

  var process = processMatch ? processMatch[2] : 'Unknown';
  logValues.push(process);

  var span = document.createElement("span");
  span.classList.add("ml-auto");

  var a = document.createElement("a");
  a.classList.add("btn");
  a.classList.add("btn-sm");
  a.classList.add("btn-outline-primary");
  a.style.margin = '5px';

  /*
  a.href = "data:text;charset=utf-8," + encodeURIComponent(content); //content
  */
  var file = new Blob([content], { type: 'text/plain' });
  a.href = URL.createObjectURL(file);
  // end
  a.download = logValues.join('-') + '.log'; //file name
  a.innerText = "Download Log";

  span.appendChild(a);
  rightColumn.appendChild(span);
})();