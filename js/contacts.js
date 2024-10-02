let contactArray = [];

async function loadContacts() {
    const contacts = await getData("contacts");
    contactArray = Object.values(contacts)[0]; 

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
    return `
    <div class="contact-item">
                <span class="contact-initial">SB</span>
                <div class="contact-info">
                    <span class="contact-name">${contactArray[index].name}</span>
                    <span class="contact-email">${contactArray[index].email}</span>
                </div>`
}