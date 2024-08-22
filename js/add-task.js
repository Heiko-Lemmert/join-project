const contactSelector = document.getElementById('contactSelector');
const contactOptions = document.getElementById('contactOptions');
const checkboxes = contactOptions.querySelectorAll('input[type="checkbox"]');
const selectedContacts = document.getElementById('selectedContacts');

contactSelector.addEventListener('click', () => {
    contactOptions.style.display = contactOptions.style.display === 'block' ? 'none' : 'block';
});

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        updateSelectedContacts();
    });
});

/**
 * updateSelectedContacts: This function collects the names of the selected contacts and 
 * updates the display in the drop-down menu as well as the list of selected contacts.
 * AND
 * click-Eventlistener: Ensures that the drop-down menu is closed when the user clicks outside the menu.
 */
function updateSelectedContacts() {
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
    if (!contactSelector.contains(event.target) && !contactOptions.contains(event.target)) {
        contactOptions.style.display = 'none';
    }
});