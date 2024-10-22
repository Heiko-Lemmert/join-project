let contactArray = [];

async function loadContacts() {
    const contactsData = await getData("contacts/-O8W_xHifJ5jIH4moSJq");
    contactArray = Array.isArray(contactsData) ? contactsData : [];
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
    let indexedContacts = contactArray.map((contact, index) => ({ ...contact, originalIndex: index }));
    let sortedContacts = indexedContacts.sort((a, b) => a.name.localeCompare(b.name));
    let currentLetter = '';

    for (let contact of sortedContacts) {
        let firstLetter = contact.name.charAt(0).toUpperCase();  

        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactSection.innerHTML += `
                <div class="contact-letter-section">
                    <span class="contact-section-letter">${currentLetter}</span>
                    <span><hr class="contact-divider"></span>
                </div>`;
        }

        contactSection.innerHTML += contactItemTemplate(contact.originalIndex);
    }
}

function contactItemTemplate(originalIndex) {
    let contact = contactArray[originalIndex];
    let initials = generateInitials(contact.name);
    let bgColor = getRandomColor();

    return `
    <div class="contact-item" onclick="showContactDetails(${originalIndex})">
        <div class="contact-avatar" style="background-color: ${bgColor}; color: white;">
            ${initials}
        </div>
        <div class="contact-info">
            <span class="contact-name">${contact.name}</span>
            <span class="contact-email">${contact.email}</span>
        </div>
    </div>`;
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

    return `          
        <div class="card-mainDivv">
            <div class="profile-section">
               <div class="profile-higher-section">
                  <div class="profile-img" style="background-color: ${bgColor}; color: white; border-radius: 50%; 
                      width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 36px;">
                      ${initials}
                  </div>
                  <img src="./assets/img/back-arrow.svg" alt="" class="back-contact-arrow" onclick="arrowDeleteContact()">
               </div>
               <div class="contact-name">
                    <h1 class="profile-name">${contact.name}</h1>
                    <div class="profile-actions">
                        <a href="#" class="profile-edit" onclick="toggleOverlay(); renderDialog(${index});">Edit</a>
                        <a href="#" class="profile-delete" onclick="deleteContact(${index});">Delete</a>
                    </div>
                </div>
            </div>
            <div class="contact-details">
                <h2 class="details-heading">Contact Information</h2>
                <p class="contact-label"><strong>Email</strong></p>
                <a href="#" class="contact-email">${contact.email}</a>
                <p class="contact-label"><strong>Phone</strong></p>
                <a href="#" class="contact-phone">${contact.number}</a>
            </div>
        </div>`;
}

function arrowDeleteContact() {
    document.getElementById('contact-card').innerHTML = '';
}

function toggleOverlay() {
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.toggle('d-none');
}

function renderDialog(index) {
    let contact = contactArray[index];
    let overlayRef = document.getElementById('overlay');
    overlayRef.innerHTML = '';
    overlayRef.innerHTML += getDialogTemplate(contact, index);
}

function getDialogTemplate(contact, index = null) {
    const title = contact ? 'Edit contact' : 'Add contact';
    const buttonText = contact ? 'Save' : 'Create contact';

    return `<div id="dialog" onclick="preventEventBubbling(event)">
        <div class="contact-form-description">
            <img src="./assets/img/Capa 2 (1).png">
            <h2>${title}</h2>
            <p>Tasks are better with a team!</p>
        </div>
        <div class="contact-form">
            <img src="./assets/img/Frame 79.png" class="profile-image">
            <div class="contact-form-text">
                <input type="text" placeholder="Name" required class="name-input" id="name-input" value="${contact ? contact.name : ''}">
                <input type="email" placeholder="Email" required class="email-input" id="email-input" value="${contact ? contact.email : ''}">
                <input type="tel" placeholder="Phone" required class="phone-input" id="phone-input" value="${contact ? contact.number : ''}">
                <div class="button-container">
                    <button class="cancel-button" onclick="toggleOverlay();">Cancel</button>
                    <button class="create-contact-button" onclick="${contact ? `saveContact(${index})` : 'addContact()'}">${buttonText}</button>
                </div>
            </div>
        </div>
    </div>`;
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
            await updateData("contacts/-O8W_xHifJ5jIH4moSJq", contactsData);
            loadContacts();
            document.getElementById('contact-card').innerHTML = '';
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
    }
}

async function saveContact(index) {  
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const number = document.getElementById('phone-input').value;

    if (!name || !email || !number) {
        alert('Bitte alle Felder ausfüllen!');
        return;
    }

    const updatedContact = {
        name: name,
        email: email,
        number: number
    };

    try {
        let contactsData = await getData("contacts/-O8W_xHifJ5jIH4moSJq");

        if (Array.isArray(contactsData)) {
            contactsData[index] = updatedContact; 
            await updateData("contacts/-O8W_xHifJ5jIH4moSJq", contactsData);
            loadContacts(); 
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Kontakts:', error);
    }
    
    document.getElementById('contact-card').innerHTML = '';
    toggleOverlay();
}