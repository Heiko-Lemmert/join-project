const contacts = [
    { name: 'Max Mustermann', initials: 'MM' },
    { name: 'Erika Musterfrau', initials: 'EM' },
    { name: 'John Doe', initials: 'JD' },
    { name: 'Jane Smith', initials: 'JS' },
    // Weitere Kontakte hier hinzufügen
];

const contactSelector = document.getElementById('contactSelector');
const selectedContacts = document.getElementById('selectedContacts');
const contactBackgroundColor = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#0038FF', '#FFE62B', '#FF4646', '#FFBB2B'];

function init() {
    renderTaskContact();
    attachEventListeners(); // Event-Listener erst nach dem Rendern der Kontakte hinzufügen
}

// Funktion zur Generierung einer zufälligen Farbe
function getRandomColor() {
    return contactBackgroundColor[Math.floor(Math.random() * contactBackgroundColor.length)];
}

function renderTaskContact() {
    const contactOptions = document.getElementById('contactOptions');
    contacts.forEach(contact => {
        contactOptions.innerHTML += `
        <div class="contact-option">
            <div class="contact-initials" style="background-color: ${getRandomColor()}">${contact.initials}</div>
            <label>${contact.name}</label>
            <input type="checkbox" name="contact" value="${contact.initials.toLowerCase()}">
        </div>`;
    });
}

function attachEventListeners() {
    const contactOptions = document.getElementById('contactOptions');
    const contactOptionsDivs = contactOptions.querySelectorAll('.contact-option');
    
    contactOptionsDivs.forEach(optionDiv => {
        optionDiv.addEventListener('click', () => {
            const checkbox = optionDiv.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked; // Toggle checkbox status
            updateSelectedContacts(); // Update selected contacts
        });
        optionDiv.querySelector('input[type="checkbox"]').addEventListener('change', () => {
            updateSelectedContacts();
        })
    });

    contactSelector.addEventListener('click', () => {
        contactOptions.style.display = contactOptions.style.display === 'block' ? 'none' : 'block';
        contactSelector.style.border = contactSelector.style.border === '1px solid rgb(144, 209, 237)' ? '1px solid #ccc;' : '1px solid #90D1ED';

    });
}

function prioChooser(prio) {
    switch (prio) {
        case 'high':
            checkedPrioBtn('prioHigh', prio);
            break;
        case 'medium':
            checkedPrioBtn('prioMedium', prio);
            break;
        case 'low':
            checkedPrioBtn('prioLow', prio);
            break;
        default:
            break;
    }
}

function checkedPrioBtn(id, prio) {
    resetPrioBtn();
    document.getElementById(id).classList.add('checked-'+prio);
}

function resetPrioBtn() {
    document.getElementById('prioHigh').classList.remove('checked-high');
    document.getElementById('prioMedium').classList.remove('checked-medium');
    document.getElementById('prioLow').classList.remove('checked-low');
}

 /**
//  * updateSelectedContacts: This function collects the names of the selected contacts and 
//  * updates the display in the drop-down menu as well as the list of selected contacts.
//  * AND
//  * click-Eventlistener: Ensures that the drop-down menu is closed when the user clicks outside the menu.
//  */
function updateSelectedContacts() {
    const contactOptions = document.getElementById('contactOptions');
    const checkboxes = contactOptions.querySelectorAll('input[type="checkbox"]');
    const selected = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selected.push(checkbox.parentElement.querySelector('label').textContent);
        }
    });

    if (selected.length > 0) {
        selectedContacts.textContent = 'Selected: ' + selected.join(', ');
        contactSelector.textContent = selected.join(', ');
    } else {
        selectedContacts.textContent = '';
        contactSelector.textContent = 'Select contacts to assign';
    }
}

document.addEventListener('click', (event) => {
    const contactOptions = document.getElementById('contactOptions');
    if (!contactSelector.contains(event.target) && !contactOptions.contains(event.target)) {
        contactOptions.style.display = 'none';
    }
});