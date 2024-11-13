/**
 * Array of colors used for contact avatars or background highlights.
 */
const contactBackgroundColor = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#0038FF', '#FFE62B', '#FF4646', '#FFBB2B'];

/**
 * Default progress status used for task initialization.
 */
let progressStatus = 'to-do';

/**
 * Includes HTML content from external files based on the `w3-include-html` attribute.
 * Used for modular HTML structure. This function loads content and re-calls itself recursively.
 */
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /* Search for elements with a specific attribute: */
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Create an HTTP request using the attribute value as the file name: */
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

/**
 * Initializes the app by including HTML and setting up initial configurations.
 */
function init() {
    includeHTML();
}

/**
 * Checks the current HTML page and assigns a specific class to the navigation element.
 * This highlights the current page in the navigation.
 */
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

/**
 * Adds a 'clicked' class to the specified element ID, marking it as active.
 * @param {string} id - The ID of the element to highlight.
 */
function addClassList(id) {
    return document.getElementById(id).classList.add('clicked');
}

/**
 * Returns a random color from the `contactBackgroundColor` array.
 * Useful for assigning unique colors to contacts.
 * @returns {string} A random color code from the array.
 */
function getRandomColor() {
    return contactBackgroundColor[Math.floor(Math.random() * contactBackgroundColor.length)];
}

/**
 * Generates initials from a contact name by taking the first letter of each name part.
 * @param {string} contact - The full name of the contact.
 * @returns {string} The initials generated from the contact's name.
 */
function generateInitials(contact) {
    let initials = '';
    let splitString = contact.split(' ');
    splitString.forEach(name => {
        initials += name.charAt(0)
    });
    return initials;
}

/**
 * Opens an information box (infobox) and loads its content. Adds an event listener 
 * to close the infobox if the user clicks outside of it.
 */
function openInfBox() {
    let content = document.getElementById('infoBox');
    content.innerHTML = generateHeaderHTML();
    content.style.display = 'block';
    document.addEventListener('click', function closeOnClickOutside(event) {
        if (!event.target.closest('.infoBox') && !event.target.closest('.header-user')) {
            closeBox();
            document.removeEventListener('click', closeOnClickOutside);
        }
    });
}

/**
 * Closes the information box (infobox) by hiding it and clearing its content.
 */
function closeBox() {
    let content = document.getElementById('infoBox');
    content.style.display = 'none';
    content.innerHTML = ''; 
}

/**
 * Displays a toast notification for a brief period.
 * @param {string} id - The ID of the toast element to show.
 */
function showToast(id) {
    const toast = document.getElementById(id);
    toast.classList.add('toast-visible');
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 3000);
}

/**
 * Generates initials for the currently logged-in user and displays them in the header.
 */
function generateInitialsForHeader() {
    const user = localStorage.getItem("currentUser");
    document.getElementById('loggedUser').innerText = generateInitials(JSON.parse(user));
}

/**
 * Prevents page scrolling by disabling overflow on the body element.
 */
function preventScrolling() {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
}

/**
 * Allows page scrolling by enabling overflow on the body element.
 */
function allowScrolling() {
    document.body.style.overflow = 'auto';
}
