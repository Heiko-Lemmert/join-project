// Für Template übegreifende JS Funktionen

// W3-HTML-Include
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
    checkHTMLforClassList();
}

function init() {
    includeHTML();
}

// Sidebar JS
function checkHTMLforClassList() {
    const currentHTML = window.location.pathname;
    switch (currentHTML) {
        case '/summary.html':
            addClassList('summary')
            break;
        case '/add-task.html':
            addClassList('addTask')
            break;
        case '/board.html':
            addClassList('board')
            break;
        case '/contacts.html':
            addClassList('contacts')
            break;
        case '/privacy-policy.html':
            addClassList('privacyPolicy')
            break;
        case '/legal-notice.html':
            addClassList('legalNotice')
            break;
        default:
            break;
    }
}

function addClassList(id) {
    return document.getElementById(id).classList.add('clicked');
}