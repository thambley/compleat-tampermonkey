// ==UserScript==
// @name         Download New Log
// @namespace    https://support.concurcompleat.com/Logs
// @updateURL    https://github.com/thambley/compleat-tampermonkey/raw/main/Download%20New%20Log.user.js
// @version      0.2
// @description  Download selected logs
// @author       thambley@tlcorporate.com
// @match        https://support.concurcompleat.com/Logs*
// @match        https://support.concurcompleat.com/logs*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    var locator = '';
    var logs = [];
    var selectedLogs = [];
    var currentHref = document.location.href;
    var old_fetch = unsafeWindow.fetch;

    function jsonHandler(json) {
        console.log(json);
        if (json.options != null) {
            locator = json.options.recordLocator;
            console.log('locator: ' + locator);
        }
        if (json.results != null) {
            console.log('results count: ' + json.results.length);
        }
        if (json.body != null) {
            console.log(json.id);
            const found = logs.find(log => log.id == json.id);
            if (found == null) {
                logs.push(json);
                console.log('logs count: ' + logs.length);
                populateSelectedLogs(currentHref);
                updateDownloadButton();
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
            return selectedLogs.map(log => log.body).join('\r\n');
        }
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
            return(filenameParts.join('-') + '.log');
        }
    }

    function updateDownloadButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        const allSnippetsButton = buttons.find(el => el.textContent === 'All Snippets');

        var downloadButton = document.getElementById('DownloadButton');

        if (downloadButton == null) {
            const allSnippetsParent = allSnippetsButton.parentNode;
            const buttonContainer = allSnippetsParent.parentNode;

            const downloadDiv = document.createElement("div");
            downloadDiv.classList.add("MuiGrid-root");
            downloadDiv.classList.add("MuiGrid-item");

            downloadButton = document.createElement("a");
            downloadButton.id = "DownloadButton";
            downloadButton.classList.add("MuiButtonBase-root");
            downloadButton.classList.add("MuiButton-root");
            downloadButton.classList.add("MuiButton-contained");
            downloadButton.classList.add("MuiButton-containedSizeSmall");
            downloadButton.classList.add("MuiButton-sizeSmall");
            downloadDiv.appendChild(downloadButton);

            var spanDownload = document.createElement("span");
            downloadButton.classList.add("MuiButton-label");
            spanDownload.innerText = "Download";
            downloadButton.appendChild(spanDownload);

            buttonContainer.appendChild(downloadDiv);
        }

        var content = getContent();
        if (content != null) {
            if (downloadButton.classList.contains('Mui-disabled')) {
                downloadButton.classList.remove('Mui-disabled');
            }
            var file = new Blob([content], { type: 'text/plain' });
            downloadButton.href = URL.createObjectURL(file);
            downloadButton.download = getFilename(content); //file name
        } else {
            if (!downloadButton.classList.contains('Mui-disabled')) {
                downloadButton.classList.add('Mui-disabled');
            }
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
                updateDownloadButton();
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);

})();