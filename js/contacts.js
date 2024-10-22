let contactArray = [];

async function loadContacts() {
    const contactsData = await getData("contacts/-O8W_xHifJ5jIH4moSJq");
    contactArray = Array.isArray(contactsData) ? contactsData : []; // Sicherstellen, dass es ein Array ist
    renderContacts();
}

async function log() {
    const contacts = await getData("contacts");
    const users = await getData("users");
    const tasks = await getData("tasks");
    console.log('contacts', contacts);
    console.log('users', users);
    console.log('tasks', tasks); 
}

log();

function renderContacts() {
    let contactSection = document.getElementById('contact-section');
    contactSection.innerHTML = '';

    // Pair contacts with their original index
    let indexedContacts = contactArray.map((contact, index) => ({ ...contact, originalIndex: index }));

    // Sort contacts by name
    let sortedContacts = indexedContacts.sort((a, b) => a.name.localeCompare(b.name));

    let currentLetter = '';

    for (let contact of sortedContacts) {
        let firstLetter = contact.name.charAt(0).toUpperCase();  

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactSection.innerHTML += generateFirstLetterHTML(currentLetter);
        }

        contactSection.innerHTML += contactItemTemplate(contact.originalIndex); // Use original index for deletion
    }
}

function contactItemTemplate(originalIndex) {
    let contact = contactArray[originalIndex];
    let initials = generateInitials(contact.name);
    let bgColor = getRandomColor();
    return generateContactHTML(index, bgColor, initials, contact);
}

function showContactDetails(index) {
    let contactDetails = document.getElementById('contact-card');
    contactDetails.innerHTML = '';
    contactDetails.innerHTML = contactDetailsTemplate(index);
}

function contactDetailsTemplate(index) {
    let contact = contactArray[index];
    let initials = generateInitials(contact.name);  
    let bgColor = getRandomColor();  
    return generateContactDetailsHTML(bgColor, initials, contact);
}

function arrowDeleteContact() {
    document.getElementById('contact-card').innerHTML = '';
}

function toggleOverlay() {
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.toggle('d-none');
}

function renderDialog(index) {
    let overlayRef = document.getElementById('overlay');
    overlayRef.innerHTML = '';
    overlayRef.innerHTML += getDialogTemplate(index);
}

async function createContact() {
    const contacts = await getData("contacts");
}

function getDialogTemplate(index) {
    return generateContactDialogHTML();
}

function preventEventBubbling(event) {
    event.stopPropagation();
}

async function addContact() { 
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const number = document.getElementById('phone-input').value;

    if (!name || !email || !number) {
        alert('Bitte alle Felder ausfüllen!');
        return;
    }

    const newContact = {
        name: name,
        email: email,
        number: number
    };

    try {
        let contactsData = await getData("contacts/-O8W_xHifJ5jIH4moSJq");

        if (Array.isArray(contactsData)) {
            contactsData.push(newContact);
        } else {
            contactsData = [newContact];
        }

        await updateData("contacts/-O8W_xHifJ5jIH4moSJq", contactsData);

        loadContacts();

    } catch (error) {
        console.error('Fehler beim Hinzufügen des Kontakts:', error);
    }

    toggleOverlay();
}

async function deleteContact(index) {
    try {
        let contactsData = await getData("contacts/-O8W_xHifJ5jIH4moSJq");

        if (Array.isArray(contactsData)) {
            contactsData.splice(index, 1); 
            await updateData("contacts/-O8W_xHifJ5jIH4moSJq", contactsData); // Aktualisiere Firebase
            loadContacts();
            document.getElementById('contact-card').innerHTML = '';
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
    }
}