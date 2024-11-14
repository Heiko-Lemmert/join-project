let contactArray = [];

/**
 * Loads contact data from the database and updates the `contactArray`.
 * Adds a random color if no color is specified for a contact.
 * @async
 */
async function loadContacts() {
    const contactsData = await getData("contacts/-O8W_xHifJ5jIH4moSJq");
    contactArray = Array.isArray(contactsData) ?
        contactsData.map(contact => ({
            ...contact,
            color: contact.color || getRandomColor()
        })) : [];
    renderContacts();
}

/**
 * Renders the contact list in the HTML view, sorting them alphabetically.
 * Displays contacts under their respective starting letters.
 */
function renderContacts() {
    let contactSection = document.getElementById('contact-section');
    contactSection.innerHTML = '';
    let indexedContacts = contactArray.map((contact, index) => ({
        ...contact,
        originalIndex: index
    }));
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

/**
 * Generates an HTML template for a single contact item.
 * @param {number} originalIndex - The index of the contact in the `contactArray`.
 * @returns {string} HTML template string for the contact item.
 */
function contactItemTemplate(originalIndex) {
    let contact = contactArray[originalIndex];
    let initials = generateInitials(contact.name);
    let bgColor = contact.color; // Use stored color

    return `
    <div id="contact-${originalIndex}" class="contact-item" onclick="showContactDetails(${originalIndex})">
        <div class="contact-avatar" style="background-color: ${bgColor}; color: white;">
            ${initials}
        </div>
        <div class="contact-info">
            <span class="contact-name">${contact.name}</span>
            <span class="contact-email">${contact.email}</span>
        </div>
    </div>`;
}

/**
 * Displays the details of the selected contact in a separate view.
 * @param {number} index - The index of the selected contact.
 */
function showContactDetails(index) {
    let contactDetails = document.getElementById('contact-card');
    let contactContent = document.querySelector('.contact-content');
    contactContent.classList.add('zindex')
    contactDetails.innerHTML = '';
    contactDetails.innerHTML = contactDetailsTemplate(index);
    preventScrolling();
    addHighlight(index);
}

/**
 * Highlights the selected contact in the contact list.
 * @param {number} id - The ID of the contact to highlight.
 */
async function addContact() {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const number = document.getElementById('phone-input').value;
    const isValid = validateForm();

    if (isValid) {
        const newContact = {
            name,
            email,
            number,
            color: getRandomColor()
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
        showToast('contactToast')
        toggleOverlay();
    } else {
        whichValueIsFalse();
    }
}

/**
 * Validates the form fields for contact creation or editing.
 * Checks if the name, email, and phone number fields are filled in and valid.
 * 
 * @returns {boolean} - Returns true if all fields are valid; otherwise, undefined.
 */
function validateForm() {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const number = document.getElementById('phone-input').value;
    const checkMail = isValidEmail(email);
    const checkPhone = isValidPhoneNumber(number);

    if (name && checkMail && checkPhone) {
        return true
    }
}

/**
 * Highlights input fields with errors based on the user's input.
 * Adds a red border to invalid fields (name, email, phone number) and removes it after 1 second.
 */
function whichValueIsFalse() {
    const name = document.getElementById('name-input');
    const email = document.getElementById('email-input');
    const number = document.getElementById('phone-input');
    const checkMail = isValidEmail(email.value);
    const checkPhone = isValidPhoneNumber(number.value);

    if (!name.value) {
        name.classList.add('required-border');
    }
    if (!checkMail) {
        email.classList.add('required-border');
    }
    if (!checkPhone) {
        number.classList.add('required-border');
    }
    setTimeout(() => {
        name.classList.remove('required-border');
        email.classList.remove('required-border');
        number.classList.remove('required-border');
    }, 1000)
}

/**
 * Clears the contact details view and removes the z-index class from the contact content section.
 * Allows page scrolling again after closing the contact details view.
 */
function arrowDeleteContact() {
    document.getElementById('contact-card').innerHTML = '';
    let contactContent = document.querySelector('.contact-content');
    contactContent.classList.remove('zindex')
    allowScrolling();
}

/**
 * Toggles the visibility of the overlay (used for editing/adding contacts).
 */
function toggleOverlay() {
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.toggle('d-none');
}

/**
 * Renders the edit dialog with the contact's information.
 * @param {number} index - The index of the contact to edit.
 */
function renderDialog(index) {
    let contact = contactArray[index];
    let overlayRef = document.getElementById('overlay');
    overlayRef.innerHTML = '';
    overlayRef.innerHTML += getDialogTemplate(contact, index);
}


/**
 * Prevents the click event from propagating to parent elements.
 * Used to stop click events from closing the dialog when interacting with the form.
 * 
 * @param {Event} event - The event object.
 */
function preventEventBubbling(event) {
    event.stopPropagation();
}

/**
 * Handles the process of deleting a contact from the database.
 * @async
 * @param {number} index - The index of the contact to delete.
 */
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

/**
 * Saves the updated contact details to the contact array and updates the database.
 * Validates the input fields before updating the contact data.
 * 
 * @async
 * @param {number} index - The index of the contact in the contact array to be updated.
 */
async function saveContact(index) {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const number = document.getElementById('phone-input').value;
    const isValid = validateForm();

    if (isValid) {
        const updatedContact = {
            name,
            email,
            number,
            color: contactArray[index].color
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

        toggleOverlay();
        document.getElementById('contact-card').innerHTML = '';
    } else {
        whichValueIsFalse();
    }
}

/**
 * Validates if the provided email has a correct format.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email format is valid; otherwise, false.
 */
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validates if the provided phone number consists of 1 to 15 digits.
 * 
 * @param {string} number - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number format is valid; otherwise, false.
 */
function isValidPhoneNumber(number) {
    const re = /^\d{1,15}$/;
    return re.test(String(number).trim());
}

/**
 * Highlights the selected contact in the contact list.
 * @param {number} id - The ID of the contact to highlight.
 */
function addHighlight(id) {
    contactArray.forEach((contact, i) => {
        document.getElementById('contact-' + i).classList.remove('contact-highlight');
    })
    document.getElementById('contact-' + id).classList.add('contact-highlight');
}