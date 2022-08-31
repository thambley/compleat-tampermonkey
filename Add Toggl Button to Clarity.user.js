// ==UserScript==
// @name         Add Toggl Button to Clarity
// @namespace    https://support.concurcompleat.com/task/
// @downloadURL  https://github.com/thambley/compleat-tampermonkey/raw/main/Add%20Toggl%20Button%20to%20Clarity.user.js
// @updateURL    https://github.com/thambley/compleat-tampermonkey/raw/main/Add%20Toggl%20Button%20to%20Clarity.user.js
// @version      0.5
// @description  Toggle button for Clarity
// @author       thambley@tlcorporate.com
// @match        https://support.concurcompleat.com/task/*
// @connect      toggl.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==



(function () {
    'use strict';

    /*------------------------------------------------------------------------
     * JavaScript Library for Toggl-Button for GreaseMonkey
     *
     * (c) Jürgen Haas, PARAGON Executive Services GmbH
     * Version: 1.9
     *
     * @see https://gitlab.paragon-es.de/toggl-button/core
     *------------------------------------------------------------------------
     */

    const togglStyle = `/*------------------------------------------------------------------------
* CSS Library for Toggl-Button for GreaseMonkey
*
* (c) Jürgen Haas, PARAGON Executive Services GmbH
* Version: 1.8
*
* @see https://gitlab.paragon-es.de/toggl-button/core
*------------------------------------------------------------------------
*/

#toggl-button-gi-wrapper {
position: fixed;
bottom: 10px;
right: 10px;
z-index: 9;
display: none;
padding: 0 0 0 30px;
border: 1px solid #999999;
-moz-box-shadow: 0 0 5px 5px #888;
-webkit-box-shadow: 0 0 5px 5px #888;
box-shadow: 0 0 5px 5px #888;
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAFa9AABWvQE1bkh1AAAAB3RJTUUH3QQeBxszNJufNAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAANsSURBVDjLrZRPaFxVFMZ/57735s1LMzMxmca0nQRCqkmTmgZSUUs1BYM70YK4CCgKunTRvQsVXRZD92rdCEWKiyhoFWOKFRFsWg1pMW1jpyltJpNkJvMv781797pI86zSShfe1eWecz++7zt/4H88cr/ANNhd3f2dKmnlxEpkmhJpKzIra/XS0jdLS6V3QT8ImMwPDAwl7eRRUda4KOkzSItgtDGmHEVmrqmjrwrV9amxfP7WfcGmwe4ZHHnRcqy3RNSTiDgiEucYYwyA1rrqR9GXa74/eWhh/pd7gcnC4MhLtmO/o5TadzeIlduDrlYxpXKcbLSO6mF05maj/vb41cvnAazt4PzA8H43Yb+nlDV6N5CkU6ReexVJpQivXgO9ZZWIKEek1xZx9vrOuTP+RsPalpftyr1p2WpCRNkAKEXi4CjuwVESg/sQ28bavQtdq2HK5RhQRHKtLnMn14qXFUBXf3+nWDIO4mwzcg89ResrE6i2DIQhJghwHn2E1BuvY+X2xHITIh2enRg/Bp4CUFYyJ0LftjxJp/CeGye48Bu1019gggBdWKHyyaeIskgeGQOl7vggyrPUY93ZnjYFIEoygrTEhu/ciZXtYPPcT9DYBGPAGPSt2/gXLuLs7QPXjdkpkXbPjVptAB1F2ti2/tv1O7cowoQhjbM/Et1ejt9QChHBxC2DrosYBdAMddEYKW/3UVRcRZfKuE88DsDmd9/T/H0O1f4QieH9hIt/Ynw/ZrapdaEYBBUboNIo3/Bcd04puxfAlEo0pn9gxwvPI46DP3sRafHwnj6MeC1szpzdYghoo6NS0/91tlAoWQC5jQ1/MNuZsix1RIlyAcLreUy9TmLkAN4zh3GHhohWV6l9fppw4Uo8EZUwzM/Vyic+3Nj4I7Zppqdn18PpjuOebb8sSsXNLK2tqEwaE0Xo9XXwg1heEEX1xXrtxPsLlz6YgWr86WS5XJ3ItN+wldXtiPSKyFbtgwBTqWCqtViaMcY0tW4sNRqnpgrFyVN+bfkf4wTw0drKzaOplku2WI4IOQXJfy8DY0xYicLrS43Gx1OF4uRkuXDtP/fZ8XS6/UB291jGtZ91lT2sRNoN6E0dLa83g/OLfv3bz/L5n2eg+kDLEeAYeN3ZbFsimdzh+1CsB5XZWqH0Nfj3yv8LMvl8kMnBqycAAAAASUVORK5CYII=) no-repeat left top;
background-color: #ffffff;
font-size: 12px;
font-family: sans-serif;
}
#toggl-button-gi-wrapper.active {
display: block;
}
#toggl-button-gi-wrapper:hover {
cursor: pointer;
}
#toggl-button-gi-wrapper.collapsed {
width: 20px;
height: 20px;
overflow: hidden;
padding: 0;
}
#toggl-button-gi-wrapper div.content {
margin: 0;
padding: 2px;
min-height: 0;
color: #000;
}
#toggl-button-gi-wrapper.collapsed div.content {
display: none;
}
#toggl-button-gi-wrapper div div {
display: inline-block;
margin: 0 2px;
}
#toggl-button-gi-wrapper div.project {
font-weight: bold;
background: none;
}
.toggl-button-active #toggl-button-gi-wrapper {
display: none;
}

#toggl-button-wrapper {
position: fixed;
bottom: 10px;
left: 10px;
z-index: 1001;
padding: 0;
border: 1px solid #999999;
-moz-box-shadow: 0 0 5px 5px #888;
-webkit-box-shadow: 0 0 5px 5px #888;
box-shadow: 0 0 5px 5px #888;
font-size: 12px;
font-family: sans-serif;
}
#toggl-button-wrapper .content {
background-color: #dddddd;
padding: 0;
margin: 0;
}
#toggl-button-wrapper .content .toggl-button-project-select {
border: none;
}
.toggl-button {
display: inline-block !important;
line-height: 20px;
padding-left: 23px;
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAFa9AABWvQE1bkh1AAAAB3RJTUUH3QQeBxszNJufNAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAANsSURBVDjLrZRPaFxVFMZ/57735s1LMzMxmca0nQRCqkmTmgZSUUs1BYM70YK4CCgKunTRvQsVXRZD92rdCEWKiyhoFWOKFRFsWg1pMW1jpyltJpNkJvMv781797pI86zSShfe1eWecz++7zt/4H88cr/ANNhd3f2dKmnlxEpkmhJpKzIra/XS0jdLS6V3QT8ImMwPDAwl7eRRUda4KOkzSItgtDGmHEVmrqmjrwrV9amxfP7WfcGmwe4ZHHnRcqy3RNSTiDgiEucYYwyA1rrqR9GXa74/eWhh/pd7gcnC4MhLtmO/o5TadzeIlduDrlYxpXKcbLSO6mF05maj/vb41cvnAazt4PzA8H43Yb+nlDV6N5CkU6ReexVJpQivXgO9ZZWIKEek1xZx9vrOuTP+RsPalpftyr1p2WpCRNkAKEXi4CjuwVESg/sQ28bavQtdq2HK5RhQRHKtLnMn14qXFUBXf3+nWDIO4mwzcg89ResrE6i2DIQhJghwHn2E1BuvY+X2xHITIh2enRg/Bp4CUFYyJ0LftjxJp/CeGye48Bu1019gggBdWKHyyaeIskgeGQOl7vggyrPUY93ZnjYFIEoygrTEhu/ciZXtYPPcT9DYBGPAGPSt2/gXLuLs7QPXjdkpkXbPjVptAB1F2ti2/tv1O7cowoQhjbM/Et1ejt9QChHBxC2DrosYBdAMddEYKW/3UVRcRZfKuE88DsDmd9/T/H0O1f4QieH9hIt/Ynw/ZrapdaEYBBUboNIo3/Bcd04puxfAlEo0pn9gxwvPI46DP3sRafHwnj6MeC1szpzdYghoo6NS0/91tlAoWQC5jQ1/MNuZsix1RIlyAcLreUy9TmLkAN4zh3GHhohWV6l9fppw4Uo8EZUwzM/Vyic+3Nj4I7Zppqdn18PpjuOebb8sSsXNLK2tqEwaE0Xo9XXwg1heEEX1xXrtxPsLlz6YgWr86WS5XJ3ItN+wldXtiPSKyFbtgwBTqWCqtViaMcY0tW4sNRqnpgrFyVN+bfkf4wTw0drKzaOplku2WI4IOQXJfy8DY0xYicLrS43Gx1OF4uRkuXDtP/fZ8XS6/UB291jGtZ91lT2sRNoN6E0dLa83g/OLfv3bz/L5n2eg+kDLEeAYeN3ZbFsimdzh+1CsB5XZWqH0Nfj3yv8LMvl8kMnBqycAAAAASUVORK5CYII=) no-repeat left top;
}
.toggl-button.hidden {
display: none !important;
}
.toggl-button.min {
height: 19px;
padding-left: 19px;
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAABIklEQVR4AYWSu0qDURCEN80fkUCwSCPk8iJ5DF/BF1Aw1Ye2NhpLQSwFn8EiMd4qb6WNEDCkEdIETVLogDm7RyzMMvwzO8ue4eRY/GiyQ583ZsKleBNLlcgqh8z5yku6q342VuM+7LzUr6WxgrvMmHAuuJZX/hk7kIh6xoSsI9+MBotIo4QnmJAlld8ydl1OaVPhFBMq4lN39owrF9us87o89EV8y50bY+SrqxxHNvGqx3k3Zks6lP2UjT1iDNO+2DahRC+7kJ70JLYNPEGbjbgG8bbza6Pj4paCTcZiY30L6eR0jDofLi9oUGJNaIin7id1w9gXjavscyYsoiffDKMc/+nfkrfy/wt5kPfrvXX9oAhwFO8tqkWHASPmwkC8Fd430YaitSJltegAAAAASUVORK5CYII=) no-repeat left top;
}
.toggl-button.min.active {
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAFa9AABWvQE1bkh1AAAAB3RJTUUH3QQeBxszNJufNAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAANsSURBVDjLrZRPaFxVFMZ/57735s1LMzMxmca0nQRCqkmTmgZSUUs1BYM70YK4CCgKunTRvQsVXRZD92rdCEWKiyhoFWOKFRFsWg1pMW1jpyltJpNkJvMv781797pI86zSShfe1eWecz++7zt/4H88cr/ANNhd3f2dKmnlxEpkmhJpKzIra/XS0jdLS6V3QT8ImMwPDAwl7eRRUda4KOkzSItgtDGmHEVmrqmjrwrV9amxfP7WfcGmwe4ZHHnRcqy3RNSTiDgiEucYYwyA1rrqR9GXa74/eWhh/pd7gcnC4MhLtmO/o5TadzeIlduDrlYxpXKcbLSO6mF05maj/vb41cvnAazt4PzA8H43Yb+nlDV6N5CkU6ReexVJpQivXgO9ZZWIKEek1xZx9vrOuTP+RsPalpftyr1p2WpCRNkAKEXi4CjuwVESg/sQ28bavQtdq2HK5RhQRHKtLnMn14qXFUBXf3+nWDIO4mwzcg89ResrE6i2DIQhJghwHn2E1BuvY+X2xHITIh2enRg/Bp4CUFYyJ0LftjxJp/CeGye48Bu1019gggBdWKHyyaeIskgeGQOl7vggyrPUY93ZnjYFIEoygrTEhu/ciZXtYPPcT9DYBGPAGPSt2/gXLuLs7QPXjdkpkXbPjVptAB1F2ti2/tv1O7cowoQhjbM/Et1ejt9QChHBxC2DrosYBdAMddEYKW/3UVRcRZfKuE88DsDmd9/T/H0O1f4QieH9hIt/Ynw/ZrapdaEYBBUboNIo3/Bcd04puxfAlEo0pn9gxwvPI46DP3sRafHwnj6MeC1szpzdYghoo6NS0/91tlAoWQC5jQ1/MNuZsix1RIlyAcLreUy9TmLkAN4zh3GHhohWV6l9fppw4Uo8EZUwzM/Vyic+3Nj4I7Zppqdn18PpjuOebb8sSsXNLK2tqEwaE0Xo9XXwg1heEEX1xXrtxPsLlz6YgWr86WS5XJ3ItN+wldXtiPSKyFbtgwBTqWCqtViaMcY0tW4sNRqnpgrFyVN+bfkf4wTw0drKzaOplku2WI4IOQXJfy8DY0xYicLrS43Gx1OF4uRkuXDtP/fZ8XS6/UB291jGtZ91lT2sRNoN6E0dLa83g/OLfv3bz/L5n2eg+kDLEeAYeN3ZbFsimdzh+1CsB5XZWqH0Nfj3yv8LMvl8kMnBqycAAAAASUVORK5CYII=) no-repeat left top;
}
.toggl-button-project-select {
display: inline-block;
width: 150px;
height: 14px;
line-height: 0;
overflow: hidden;
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAABIklEQVR4AYWSu0qDURCEN80fkUCwSCPk8iJ5DF/BF1Aw1Ye2NhpLQSwFn8EiMd4qb6WNEDCkEdIETVLogDm7RyzMMvwzO8ue4eRY/GiyQ583ZsKleBNLlcgqh8z5yku6q342VuM+7LzUr6WxgrvMmHAuuJZX/hk7kIh6xoSsI9+MBotIo4QnmJAlld8ydl1OaVPhFBMq4lN39owrF9us87o89EV8y50bY+SrqxxHNvGqx3k3Zks6lP2UjT1iDNO+2DahRC+7kJ70JLYNPEGbjbgG8bbza6Pj4paCTcZiY30L6eR0jDofLi9oUGJNaIin7id1w9gXjavscyYsoiffDKMc/+nfkrfy/wt5kPfrvXX9oAhwFO8tqkWHASPmwkC8Fd430YaitSJltegAAAAASUVORK5CYII=) no-repeat right #ddd;
border: 1px solid #ccc;
margin-left: 5px;
}
.toggl-button-project-select select {
background: transparent;
width: 268px;
padding: 0 2px;
font-size: 10px;
line-height: 1em;
border: 0;
border-radius: 0;
height: 12px;
-webkit-appearance: none;
}
#toggl-button-auth-failed {
display: block;
position: fixed;
z-index: 999;
top: 0;
left: 0;
right: 0;
height: 25px;
padding: 5px;
background-color: #ff0000;
color: #ffffff;
text-align: center;
font-weight: bold;
}
#toggl-button-auth-failed .content {
display: inline-block;
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAABIklEQVR4AYWSu0qDURCEN80fkUCwSCPk8iJ5DF/BF1Aw1Ye2NhpLQSwFn8EiMd4qb6WNEDCkEdIETVLogDm7RyzMMvwzO8ue4eRY/GiyQ583ZsKleBNLlcgqh8z5yku6q342VuM+7LzUr6WxgrvMmHAuuJZX/hk7kIh6xoSsI9+MBotIo4QnmJAlld8ydl1OaVPhFBMq4lN39owrF9us87o89EV8y50bY+SrqxxHNvGqx3k3Zks6lP2UjT1iDNO+2DahRC+7kJ70JLYNPEGbjbgG8bbza6Pj4paCTcZiY30L6eR0jDofLi9oUGJNaIin7id1w9gXjavscyYsoiffDKMc/+nfkrfy/wt5kPfrvXX9oAhwFO8tqkWHASPmwkC8Fd430YaitSJltegAAAAASUVORK5CYII=) no-repeat left top;
padding-left: 35px;
}
#toggl-button-auth-failed .content a {
padding-left: 10px;
color: #ffffff;
text-decoration: underline;
}
`;

    function TogglButtonGM(selector, renderer) {

        var $activeApiUrl = null,
            $apiUrl = "https://api.track.toggl.com/api/v9",
            $newApiUrl = "https://api.track.toggl.com/api/v9",
            $legacyApiUrl = "https://new.toggl.com/api/v8",
            $triedAlternative = false,
            $addedDynamicListener = false,
            $api_token = null,
            $default_wid = null,
            $clientMap = {},
            $projectMap = {},
            $instances = {};

        init(selector, renderer);

        function init(selector, renderer, apiUrl) {
            var timeNow = new Date().getTime(),
                timeAuth = GM_getValue('_authenticated', 0);

            apiUrl = apiUrl || $newApiUrl;
            console.log(`URL: ${apiUrl}`);
            $api_token = GM_getValue('_api_token', false);
            console.log(`API TOKEN: ${$api_token}`);
            if (!$api_token) {
                let api_token = window.prompt("toggl api token:");
                GM_setValue('_api_token', api_token);
                $api_token = GM_getValue('_api_token', false);
                console.log(`API TOKEN: ${$api_token}`);
            }

            if ($api_token && (timeNow - timeAuth) < (6*60*60*1000)) {
                $activeApiUrl = GM_getValue('_api_url', $newApiUrl);
                $default_wid = GM_getValue('_default_wid', 0);
                $clientMap = JSON.parse(GM_getValue('_clientMap', "{}"));
                $projectMap = JSON.parse(GM_getValue('_projectMap', "{}"));
                if ($activeApiUrl == $legacyApiUrl) {
                    // See issue #22.
                    $activeApiUrl = $newApiUrl;
                    GM_setValue('_api_url', $activeApiUrl);
                }
                render(selector, renderer);
                return;
            }

            var headers = {};
            if ($api_token) {
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa($api_token + ':api_token')
                };
            }
            $activeApiUrl = apiUrl;

            function createTag(name, className, innerHTML) {
                var tag = document.createElement(name);
                tag.className = className;

                if (innerHTML) {
                    tag.innerHTML = innerHTML;
                }

                return tag;
            }

            function createLink(className, tagName, linkHref, linkText) {
                // Param defaults
                tagName = tagName || 'a';
                linkHref = linkHref || '#';
                linkText = linkText || 'Start timer';

                var link = createTag(tagName, className);

                if (tagName === 'a') {
                    link.setAttribute('href', linkHref);
                }

                link.appendChild(document.createTextNode(linkText));
                return link;
            }

            function getClients(workspaceId, callback) {
                var url = `${apiUrl}/workspaces/${workspaceId}/clients`;
                console.log(`attempting to get ${url}`);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: headers,
                    onload: function (clientResult) {
                        $clientMap[0] = 'No Client';
                        if (clientResult.status === 200) {
                            var clients = JSON.parse(clientResult.responseText);
                            console.log(clientResult.responseText);
                            if (clients) {
                                clients.forEach(function (client) {
                                    $clientMap[client.id] = client.name;
                                });
                            }
                        } else {
                            console.log(`client result status ${clientResult.status}`);
                        }
                        GM_setValue('_clientMap', JSON.stringify($clientMap));
                        callback();
                    }
                });
            }

            function getProjects(workspaceId, callback) {
                var url = `${apiUrl}/workspaces/${workspaceId}/projects`;
                // var url = `${apiUrl}/me/projects`;
                console.log(`attempting to get ${url}`);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: headers,
                    onload: function (projectResult) {
                        if (projectResult.status === 200) {
                            var projects = JSON.parse(projectResult.responseText);
                            console.log(projectResult.responseText);
                            if (projects) {
                                projects.forEach(function (project) {
                                    if ($clientMap[project.cid] == undefined) {
                                        project.cid = 0;
                                    }
                                    if (project.active) {
                                        $projectMap[project.id] = {
                                            id: project.id,
                                            cid: project.cid,
                                            name: project.name,
                                            billable: project.billable
                                        };
                                    }
                                });
                            }
                            GM_setValue('_projectMap', JSON.stringify($projectMap));
                            callback();
                        } else {
                            console.log(`project result status ${projectResult.status}`);
                        }
                    }
                });
            }

            console.log(`attempting to get ${apiUrl}/me`);
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl + "/me",
                headers: headers,
                onload: function (result) {
                    if (result.status === 200) {
                        console.log(result.responseText);
                        var resp = JSON.parse(result.responseText);
                        GM_setValue('_authenticated', new Date().getTime());
                        GM_setValue('_api_token', resp.api_token);
                        GM_setValue('_api_url', $activeApiUrl);
                        GM_setValue('_default_wid', resp.default_workspace_id);
                        $api_token = resp.api_token;
                        $default_wid = resp.default_workspace_id;
                        const dorender = function () { render(selector, renderer) };
                        const doGetProjects = function () { getProjects(resp.default_workspace_id, dorender) };
                        getClients(resp.default_workspace_id, doGetProjects);
                    } else if (!$triedAlternative) {
                        console.log(`result status ${result.status} trying alternative`);
                        $triedAlternative = true;
                        if (apiUrl === $apiUrl) {
                            init(selector, renderer, $newApiUrl);
                        } else if (apiUrl === $newApiUrl) {
                            init(selector, renderer, $apiUrl);
                        }
                    } else if ($api_token) {
                        // Delete the API token and try again
                        GM_setValue('_api_token', false);
                        $triedAlternative = false;
                        init(selector, renderer, $newApiUrl);
                    } else {
                        var wrapper = document.createElement('div'),
                            content = createTag('div', 'content'),
                            link = createLink('login', 'a', 'https://toggl.com/login/', 'Login');
                        GM_addStyle(togglStyle);
                        link.setAttribute('target', '_blank');
                        wrapper.setAttribute('id', 'toggl-button-auth-failed');
                        content.appendChild(document.createTextNode('Authorization to your Toggl account failed!'));
                        content.appendChild(link);
                        wrapper.appendChild(content);
                        document.querySelector('body').appendChild(wrapper);
                    }
                }
            });
        }

        function render(selector, renderer) {
            if (selector == null) {
                return;
            }
            var i, len, elems = document.querySelectorAll(selector + ':not(.toggl)');
            for (i = 0, len = elems.length; i < len; i += 1) {
                elems[i].classList.add('toggl');
                $instances[i] = new TogglButtonGMInstance(renderer(elems[i]));
            }

            if (!$addedDynamicListener) {
                $addedDynamicListener = true;

                document.addEventListener('TogglButtonGMUpdateStatus', function () {
                    var url = `${$activeApiUrl}/me/time_entries/current`;
                    console.log(`attempting to get ${url} (in render)`);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Basic " + btoa($api_token + ':api_token')
                        },
                        onload: function (result) {
                            if (result.status === 200) {
                                var resp = JSON.parse(result.responseText),
                                    data = resp || false;
                                for (i in $instances) {
                                    $instances[i].checkCurrentLinkStatus(data);
                                }
                            } else {
                                console.log(`${url} response status ${result.status}`);
                            }
                        }
                    });
                });

                window.addEventListener('focus', function () {
                    document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
                });

                if (selector !== 'body') {
                    document.body.addEventListener('DOMSubtreeModified', function () {
                        setTimeout(function () {
                            render(selector, renderer);
                        }, 1000);
                    });
                }
            }
        }

        this.clickLinks = function () {
            for (i in $instances) {
                $instances[i].clickLink();
            }
        };

        this.getCurrentTimeEntry = function (callback) {
            var url = `${$activeApiUrl}/me/time_entries/current`;
            console.log(`attempting to get ${url}`);
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa($api_token + ':api_token')
                },
                onload: function (result) {
                    if (result.status === 200) {
                        var resp = JSON.parse(result.responseText),
                            data = resp || false;
                        if (data) {
                            callback(data.id, true);
                        }
                    } else {
                        console.log(`${url} response status ${result.status}`);
                    }
                }
            });
        };

        this.stopTimeEntry = function (entryId, asCallback) {
            if (entryId == null) {
                if (asCallback) {
                    return;
                }
                this.getCurrentTimeEntry(this.stopTimeEntry);
                return;
            }
            // var url = `${$activeApiUrl}/workspaces/${$default_wid}/time_entries/${entryId}/stop`
            var url = `${$activeApiUrl}/time_entries/${entryId}/stop`
            console.log(`attempting to patch ${url}`);
            GM_xmlhttpRequest({
                method: "PATCH",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa($api_token + ':api_token')
                },
                onload: function () {
                    document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
                }
            });
        };

        function TogglButtonGMInstance(params) {

            var
                $curEntryId = null,
                $isStarted = false,
                $link = null,
                $generalInfo = null,
                $buttonTypeMinimal = false,
                $projectSelector = window.location.host,
                $projectId = null,
                $projectSelected = false,
                $projectSelectElem = null,
                $stopCallback = null,
                $tags = params.tags || [];

            this.checkCurrentLinkStatus = function (data) {
                var started, updateRequired = false;
                if (!data) {
                    if ($isStarted) {
                        updateRequired = true;
                        started = false;
                    }
                } else {
                    if ($generalInfo != null) {
                        if (!$isStarted || ($curEntryId != null && $curEntryId != data.id)) {
                            $curEntryId = data.id;
                            $isStarted = false;
                        }
                    }
                    if ($curEntryId == data.id) {
                        if (!$isStarted) {
                            updateRequired = true;
                            started = true;
                        }
                    } else {
                        if ($isStarted) {
                            updateRequired = true;
                            started = false;
                        }
                    }
                }
                if (updateRequired) {
                    if (!started) {
                        $curEntryId = null;
                    }
                    if ($link != null) {
                        updateLink(started);
                    }
                    if ($generalInfo != null) {
                        if (data) {
                            var projectName = 'No project',
                                clientName = 'No client';
                            if (data.pid !== undefined) {
                                if ($projectMap[data.pid] == undefined) {
                                    GM_setValue('_authenticated', 0);
                                    window.location.reload();
                                    return;
                                }
                                projectName = $projectMap[data.pid].name;
                                clientName = $clientMap[$projectMap[data.pid].cid];
                            }
                            var content = createTag('div', 'content'),
                                contentClient = createTag('div', 'client'),
                                contentProject = createTag('div', 'project'),
                                contentDescription = createTag('div', 'description');
                            contentClient.innerHTML = clientName;
                            contentProject.innerHTML = projectName;
                            contentDescription.innerHTML = data.description;
                            content.appendChild(contentClient);
                            content.appendChild(contentProject);
                            content.appendChild(contentDescription);
                            while ($generalInfo.firstChild) {
                                $generalInfo.removeChild($generalInfo.firstChild);
                            }
                            $generalInfo.appendChild(content);
                        }
                        updateGeneralInfo(started);
                    }
                }
            };

            this.clickLink = function (data) {
                $link.dispatchEvent(new CustomEvent('click'));
            };

            createTimerLink(params);

            function createTimerLink(params) {
                GM_addStyle(togglStyle);
                if (params.generalMode !== undefined && params.generalMode) {
                    $generalInfo = document.createElement('div');
                    $generalInfo.id = 'toggl-button-gi-wrapper';
                    $generalInfo.addEventListener('click', function (e) {
                        e.preventDefault();
                        $generalInfo.classList.toggle('collapsed');
                    });
                    document.querySelector('body').appendChild($generalInfo);
                    document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
                    return;
                }
                if (params.projectIds !== undefined) {
                    $projectSelector += '-' + params.projectIds.join('-');
                }
                if (params.stopCallback !== undefined) {
                    $stopCallback = params.stopCallback;
                }
                updateProjectId();
                $link = createLink('toggl-button');
                $link.classList.add(params.className);

                if (params.buttonType === 'minimal') {
                    $link.classList.add('min');
                    $link.removeChild($link.firstChild);
                    $buttonTypeMinimal = true;
                }

                $link.addEventListener('click', function (e) {
                    var opts = '';
                    e.preventDefault();
                    if ($isStarted) {
                        stopTimeEntry();
                    } else {
                        var billable = false;
                        if ($projectId != undefined && $projectId > 0) {
                            billable = $projectMap[$projectId].billable;
                        }
                        opts = {
                            $projectId: $projectId || null,
                            billable: billable,
                            description: invokeIfFunction(params.description),
                            createdWith: 'TogglButtonGM - ' + params.className
                        };
                        createTimeEntry(opts);
                    }
                    return false;
                });

                // new button created - reset state
                $isStarted = false;

                // check if our link is the current time entry and set the state if it is
                checkCurrentTimeEntry({
                    $projectId: $projectId,
                    description: invokeIfFunction(params.description)
                });

                document.querySelector('body').classList.add('toggl-button-available');
                if (params.targetSelectors == undefined) {
                    var wrapper,
                        existingWrapper = document.querySelectorAll('#toggl-button-wrapper'),
                        content = createTag('div', 'content');
                    content.appendChild($link);
                    content.appendChild(createProjectSelect());
                    if (existingWrapper.length > 0) {
                        wrapper = existingWrapper[0];
                        while (wrapper.firstChild) {
                            wrapper.removeChild(wrapper.firstChild);
                        }
                        wrapper.appendChild(content);
                    }
                    else {
                        wrapper = document.createElement('div');
                        wrapper.id = 'toggl-button-wrapper';
                        wrapper.appendChild(content);
                        document.querySelector('body').appendChild(wrapper);
                    }
                } else {
                    var elem = params.targetSelectors.context || document;
                    if (params.targetSelectors.link != undefined) {
                        elem.querySelector(params.targetSelectors.link).appendChild($link);
                    }
                    if (params.targetSelectors.projectSelect != undefined) {
                        elem.querySelector(params.targetSelectors.projectSelect).appendChild(createProjectSelect());
                    }
                }

                return $link;
            }

            function createTimeEntry(timeEntry) {
                var start = new Date();
                var time_entry = {
                    start: start.toISOString(),
                    description: timeEntry.description,
                    wid: $default_wid,
                    pid: parseInt(timeEntry.$projectId, 10) || null,
                    project_id: parseInt(timeEntry.$projectId, 10) || null,
                    billable: timeEntry.billable || false,
                    duration: -Math.floor(start.getTime() / 1000),
                    tags: '$tags',
                    created_with: timeEntry.createdWith || 'TogglButtonGM'
                };
                var time_entry_json = JSON.stringify(time_entry);
                if ($tags.length > 0) {
                    time_entry_json = time_entry_json.replace('"$tags"', '["' + $tags.join('", "') + '"]');
                } else {
                    time_entry_json = time_entry_json.replace('"$tags"', '[]');
                }
                // var url = `${$activeApiUrl}/workspaces/${$default_wid}/time_entries`;
                var url = `${$activeApiUrl}/time_entries`
                console.log(`attempting to post ${url}`);
                console.log(time_entry_json);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic " + btoa($api_token + ':api_token')
                    },
                    data: time_entry_json,
                    onload: function (res) {
                        if (res.status === 200) {
                            var responseData, entryId;
                            responseData = JSON.parse(res.responseText);
                            entryId = responseData && responseData.id;
                            $curEntryId = entryId;
                            document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
                        } else {
                            console.log(`${url} response status ${res.status}`);
                            console.log(res.responseText);
                        }
                    }
                });
            }

            function checkCurrentTimeEntry(params) {
                var url = `${$activeApiUrl}/me/time_entries/current`;
                console.log(`attempting to get ${url}`);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic " + btoa($api_token + ':api_token')
                    },
                    onload: function (result) {
                        if (result.status === 200) {
                            var resp = JSON.parse(result.responseText);
                            if (params.description === resp.description) {
                                $curEntryId = resp.id;
                                updateLink(true);
                            }
                        }
                    }
                });
            }

            function stopTimeEntry(entryId) {
                entryId = entryId || $curEntryId;
                if (!entryId) {
                    return;
                }
                // var url = `${$activeApiUrl}/workspaces/${$default_wid}/time_entries/${entryId}/stop`;
                var url = `${$activeApiUrl}/time_entries/${entryId}/stop`;
                console.log(`attempting to patch ${url}`);
                GM_xmlhttpRequest({
                    method: "PATCH",
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic " + btoa($api_token + ':api_token')
                    },
                    onload: function (result) {
                        $curEntryId = null;
                        document.dispatchEvent(new CustomEvent('TogglButtonGMUpdateStatus'));
                        if (result.status === 200) {
                            var resp = JSON.parse(result.responseText),
                                data = resp.data || false;
                            if (data) {
                                if ($stopCallback !== undefined && $stopCallback !== null) {
                                    var currentdate = new Date();
                                    $stopCallback((currentdate.getTime() - (data.duration * 1000)), data.duration);
                                }
                            }
                        }
                    }
                });
            }

            function createTag(name, className, innerHTML) {
                var tag = document.createElement(name);
                tag.className = className;

                if (innerHTML) {
                    tag.innerHTML = innerHTML;
                }

                return tag;
            }

            function createLink(className, tagName, linkHref, linkText) {
                // Param defaults
                tagName = tagName || 'a';
                linkHref = linkHref || '#';
                linkText = linkText || 'Start timer';

                var link = createTag(tagName, className);

                if (tagName === 'a') {
                    link.setAttribute('href', linkHref);
                }

                link.appendChild(document.createTextNode(linkText));
                return link;
            }

            function updateGeneralInfo(started) {
                if (started) {
                    $generalInfo.classList.add('active');
                } else {
                    $generalInfo.classList.remove('active');
                }
                $isStarted = started;
            }

            function updateLink(started) {
                var linkText, color = '';

                if (started) {
                    document.querySelector('body').classList.add('toggl-button-active');
                    $link.classList.add('active');
                    color = '#1ab351';
                    linkText = 'Stop timer';
                } else {
                    document.querySelector('body').classList.remove('toggl-button-active');
                    $link.classList.remove('active');
                    linkText = 'Start timer';
                }
                $isStarted = started;

                $link.setAttribute('style', 'color:' + color + ';');
                if (!$buttonTypeMinimal) {
                    $link.innerHTML = linkText;
                }

                $projectSelectElem.disabled = $isStarted;
            }

            function updateProjectId(id) {
                id = id || GM_getValue($projectSelector, 0);

                $projectSelected = (id != 0);

                if (id <= 0) {
                    $projectId = null;
                }
                else {
                    $projectId = id;
                }

                if ($projectSelectElem != undefined) {
                    $projectSelectElem.value = id;
                    $projectSelectElem.disabled = $isStarted;
                }

                GM_setValue($projectSelector, id);

                if ($link != undefined) {
                    if ($projectSelected) {
                        $link.classList.remove('hidden');
                    }
                    else {
                        $link.classList.add('hidden');
                    }
                }
            }

            function invokeIfFunction(trial) {
                if (trial instanceof Function) {
                    return trial();
                }
                return trial;
            }

            function createProjectSelect() {
                var pid,
                    wrapper = createTag('div', 'toggl-button-project-select'),
                    noneOptionAdded = false,
                    noneOption = document.createElement('option'),
                    emptyOption = document.createElement('option'),
                    resetOption = document.createElement('option');

                $projectSelectElem = createTag('select');

                // None Option to indicate that a project should be selected first
                if (!$projectSelected) {
                    noneOption.setAttribute('value', '0');
                    noneOption.text = '- First select a project -';
                    $projectSelectElem.appendChild(noneOption);
                    noneOptionAdded = true;
                }

                // Empty Option for tasks with no project
                emptyOption.setAttribute('value', '-1');
                emptyOption.text = 'No Project';
                $projectSelectElem.appendChild(emptyOption);

                var optgroup, project, clientMap = [];
                for (pid in $projectMap) {
                    //noinspection JSUnfilteredForInLoop
                    project = $projectMap[pid];
                    if (clientMap[project.cid] == undefined) {
                        optgroup = createTag('optgroup');
                        optgroup.label = $clientMap[project.cid];
                        clientMap[project.cid] = optgroup;
                        $projectSelectElem.appendChild(optgroup);
                    } else {
                        optgroup = clientMap[project.cid];
                    }
                    var option = document.createElement('option');
                    option.setAttribute('value', project.id);
                    option.text = project.name;
                    optgroup.appendChild(option);
                }

                // Reset Option to reload settings and projects from Toggl
                resetOption.setAttribute('value', 'RESET');
                resetOption.text = 'Reload settings';
                $projectSelectElem.appendChild(resetOption);

                $projectSelectElem.addEventListener('change', function () {
                    if ($projectSelectElem.value == 'RESET') {
                        GM_setValue('_authenticated', 0);
                        window.location.reload();
                        return;
                    }

                    if (noneOptionAdded) {
                        $projectSelectElem.removeChild(noneOption);
                        noneOptionAdded = false;
                    }

                    updateProjectId($projectSelectElem.value);

                });

                updateProjectId($projectId);

                wrapper.appendChild($projectSelectElem);
                return wrapper;
            }
        }

    }

    // CUSTOM STUFF HERE
    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function getCookie(name) {
        var value = '';
        var searchText = name + '=';
        var cookies = document.cookie.split(';');
        var filteredCookies = cookies.filter((function (cookieText) { return 0 == cookieText.trim().indexOf(searchText) }));
        if (filteredCookies.length > 0) {
            value = filteredCookies[0].trim().slice(searchText.length);
        }
        return value;
    }

    function getHeaders() {
        return new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: 'Bearer ' + getCookie('ClarityAPIAccess')
        });
    }

    function jsonHandler(json) {
        if (buttonInitialized) return;
        buttonInitialized = true;

        console.log(json);

        if (json.title != null && json.id != null) {
            console.log('id: ' + json.id);
            console.log('title: ' + json.title);

            new TogglButtonGM('body', function () {
                return {
                    className: 'clarity',
                    description: json.title + ' CT#' + json.id,
                    projectIds: [],
                    tags: []
                };
            });
        }
    }

    // clone the response to be handled by the original handler
    function responseHandler(response) {
        response.json().then(jsonHandler);
    }

    if (!inIframe())
    {
        var buttonInitialized = false;

        var myInit = {
            method: 'GET',
            headers: getHeaders(),
        };

        var taskId = document.location.pathname.split('/').pop();

        unsafeWindow.fetch("https://clarityapi.concurcompleat.com/api/v1/tasks/" + taskId, myInit).then(responseHandler);
    }

})();