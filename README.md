# compleat-tampermonkey

Tampermonkey scripts for Compleat logs

## Monitor Fetch

Output information to console log about fetch requests and responses.

[link](https://github.com/thambley/compleat-tampermonkey/raw/main/Monitor%20Fetch.user.js)

## Download Log

Add button to Compleat log page to download a log as a text file.

[link](https://github.com/thambley/compleat-tampermonkey/raw/main/Download%20New%20Log.user.js)

## Download XML

Add buttton to Compleat log page to download xml used to check for changes during ticketing

[link](https://github.com/thambley/compleat-tampermonkey/raw/main/Download%20New%20XML.user.js)

## Add Process Name to Log

Adds process/workflow name to Compleat log page.

[link](https://github.com/thambley/compleat-tampermonkey/raw/main/Add%20Process%20Name%20to%20New%20Log.user.js)

## View Log

View Compleat log with additional formatting.

[link](https://github.com/thambley/compleat-tampermonkey/raw/main/View%20New%20Log.user.js)

## Prep

To prepare View Log

1. run `node btoa.js log-to-html.html`
2. copy contents of b64.txt into View Log.user.js on line 20 `var htmlContent = 'b64txtcontent'`
