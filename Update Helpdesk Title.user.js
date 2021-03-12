// ==UserScript==
// @name         Update Helpdesk Title
// @namespace    http://helpdesk.travelleaders.com/
// @version      0.3
// @description  update title on helpdesk
// @author       You
// @match        http*://helpdesk.travelleaders.com/*WorkOrder.do*
// @match        http*://helpdesk.travelleaders.com/app/itdesk/ui/requests/*/details*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function updateTitle() {
        let numElem = document.querySelector('#reqid'),
            titleElem = document.querySelector('.details-left h1'),
            description = '';

        if (titleElem) {
            description = titleElem.textContent.trim();

            if (numElem == null) {
                numElem = document.querySelector("td[data-sdplayoutid='display_id']");
            }

            if (numElem !== null) {
                description += ' ' + numElem.textContent.trim();
            }

            if (description.length > 0) {
                document.title = description;
            }
        } else {
            setTimeout(updateTitle, 5000);
        }
    }

    updateTitle();
})();