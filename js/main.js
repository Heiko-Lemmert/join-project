// Für Template übegreifende JS Funktionen
const contactBackgroundColor = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#0038FF', '#FFE62B', '#FF4646', '#FFBB2B'];

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
    generateInitialsForHeader();

}

function init() {
    includeHTML();
    setWelcomeText();
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

// Funktion zur Generierung einer zufälligen Farbe
function getRandomColor() {
    return contactBackgroundColor[Math.floor(Math.random() * contactBackgroundColor.length)];
}

function generateInitials(contact) {
    let initials = '';
    let splitString = contact.split(' ');
    splitString.forEach(name => {
        initials += name.charAt(0)
    });
    return initials;
}

//header

function openInfBox() {
    let content = document.getElementById('infoBox');
    content.innerHTML = generateHeaderHTML();
    content.style.display = 'block';

    // Füge den Event-Listener zum Dokument hinzu
    document.addEventListener('click', function closeOnClickOutside(event) {
        // Überprüfe, ob der Klick außerhalb der Info-Box stattfindet
        console.log('Event ausgelöst:', event.target);  // Überprüfen, ob der Event-Listener überhaupt ausgelöst wird

        if (!event.target.closest('.infoBox') && !event.target.closest('.header-user')) {
            console.log('Klick war außerhalb der InfoBox und header-user');  // Verfolge, ob diese Bedingung erfüllt ist

            closeBox();
            console.log('Klick close');  // Verfolge, ob diese Bedingung erfüllt ist

            document.removeEventListener('click', closeOnClickOutside); // Entferne den Event-Listener, wenn geschlossen wird
        }
    });
}

function closeBox() {
    let content = document.getElementById('infoBox');
    content.style.display = 'none';
    content.innerHTML = ''; // Entferne den Inhalt der Info-Box
}


function showToast(id) {
    const toast = document.getElementById(id);

    // Zeige die Toast-Nachricht an
    toast.classList.add('toast-visible');

    // Nach 3 Sekunden die Toast-Nachricht verschwinden lassen
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 3000);
}

function generateInitialsForHeader() {
    const user = localStorage.getItem("currentUser");
    document.getElementById('loggedUser').innerText = generateInitials(JSON.parse(user));
}