let contactArray = [];

async function loadContacts() {
    const contacts = await getData("contacts");
    contactArray = Object.values(contacts)[0];
    console.log(contactArray);


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

    // Kontakte alphabetisch nach Name sortieren
    let sortedContacts = contactArray.sort((a, b) => a.name.localeCompare(b.name));

    let currentLetter = '';

    // Kontaktliste durchgehen
    for (let index = 0; index < sortedContacts.length; index++) {
        let contact = sortedContacts[index];
        let firstLetter = contact.name.charAt(0).toUpperCase();  // Anfangsbuchstabe

        // Wenn ein neuer Anfangsbuchstabe kommt, erstelle eine neue Sektion
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactSection.innerHTML += `
                <div class="contact-letter-section">
                    <span class="contact-section-letter">${currentLetter}</span>
                    <span><hr class="contact-divider"></span>
                </div>`;
        }

        // Kontakt hinzufügen
        contactSection.innerHTML += contactItemTemplate(index);
    }
}

function contactItemTemplate(index) {
    let contact = contactArray[index];
    let initials = generateInitials(contact.name);
    let bgColor = getRandomColor();

    return `
    <div class="contact-item" onclick="showContactDetails(${index})">
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
                  <!-- Initialen anstelle eines Bildes, mit zufälliger Hintergrundfarbe -->
                  <div class="profile-img" style="background-color: ${bgColor}; color: white; border-radius: 50%; 
                      width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 36px;">
                      ${initials}
                  </div>
                  <img src="./assets/img/back-arrow.svg" alt="" class="back-contact-arrow" onclick="arrowDeleteContact()">
               </div>
               <div class="contact-name">
                    <h1 class="profile-name">${contact.name}</h1>
                    <div class="profile-actions">
                        <a href="#" class="profile-edit" onclick="toggleOverlay(); renderDialog();">Edit</a>
                        <a href="#" class="profile-delete">Delete</a>
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
    let overlayRef = document.getElementById('overlay');
    overlayRef.innerHTML = '';
    overlayRef.innerHTML += getDialogTemplate(index);
}

async function createContact() {
    const contacts = await getData("contacts");
}

function getDialogTemplate(index) {
    return `<div id="dialog" onclick="preventEventBubbling(event)">
    <div class="contact-form-description">
        <img src="./assets/img/Capa 2 (1).png">
        <h2>Add contact</h2>
        <p>Tasks are better with a team!</p>
    </div>
    <div class="contact-form">
        <img src="./assets/img/Frame 79.png" class="profile-image">
        <div class="contact-form-text">
            <input type="text" placeholder="Name" class="name-input">
            <img src="" alt="" class="email-icon"> 
            <input type="email" placeholder="Email" class="email-input">
            <img src="" alt="" class="phone-icon">
            <input type="tel" placeholder="Phone" class="phone-input">
            <div class="button-container">
                <button class="cancel-button" onclick="toggleOverlay();">Cancel</button>
                <button class="create-contact-button" onclick="createContact();">Create contact</button>
            </div>
        </div>
      </div>
    </div>`
}

function preventEventBubbling(event) {
    event.stopPropagation();
}
