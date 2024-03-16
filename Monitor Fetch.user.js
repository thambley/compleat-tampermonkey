// ==UserScript==
// @name         Monitor fetch
// @namespace    https://support.concurcompleat.com/Logs
// @downloadURL  https://github.com/thambley/compleat-tampermonkey/raw/main/Monitor%20Fetch.user.js
// @updateURL    https://github.com/thambley/compleat-tampermonkey/raw/main/Monitor%20Fetch.user.js
// @version      0.1
// @description  Watch fetch requests and responses on compleat logs and output information to console log
// @author       thambley@tlcorporate.com
// @match        https://support.concurcompleat.com/Logs*
// @match        https://support.concurcompleat.com/logs*
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  // clone the response to be handled by the original handler
  function responseHandler(response) {
    // console.log(response.body);
    var clonedResponse = response.clone();
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
      }
    });
  });

  var config = {
    childList: true,
    subtree: true
  };

  observer.observe(bodyList, config);
})();