let contactArray = [];

async function loadContacts() {
    const contacts = await getData("contacts");
    contactArray = Object.values(contacts)[0];
    console.log(contactArray);
     

    renderContacts();
}

function renderContacts() {
    let contactSection = document.getElementById('contact-section');
    contactSection.innerHTML = '';

    for (let index = 0; index < contactArray.length; index++) {
        contactSection.innerHTML += contactItemTemplate(index);
        
    }
}

function contactItemTemplate(index) {
    return `<div class="contact-item" onclick="showContactDetails(${index})">
    <span class="contact-initial">SB</span>
    <div class="contact-info">
    <span class="contact-name">${contactArray[index].name}</span>
    <span class="contact-email">${contactArray[index].email}</span>
    </div>
    </div>`
}

function showContactDetails(index) {
    let contactDetails = document.getElementById('contact-card');
    contactDetails.innerHTML = '';
    contactDetails.innerHTML = contactDetailsTemplate(index);
}

function contactDetailsTemplate(index) {
    return `            <div class="profile-section">
                <img class="profile-img">
                <div class="contact-name">
                    <h1 class="profile-name">${contactArray[index].name}</h1>
                    <div class="profile-actions">
                    <a href="#" class="profile-edit">Edit</a>
                    <a href="#" class="profile-delete">Delete</a>
                    </div>
                </div>
            </div>
            <div class="contact-details">
                <h2 class="details-heading">Contact Information</h2>
                <p class="contact-label"><strong>Email</strong></p>
                <a href="#" class="contact-email">${contactArray[index].email}</a>
                <p class="contact-label"><strong>Phone</strong></p>
                <a href="#" class="contact-phone">${contactArray[index].number}</a>
            </div>`
}
