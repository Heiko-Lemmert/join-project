async function loadContacts() {
    const contacts = await getData("contacts");

    if (contacts) {
        console.log(contacts);
        
    } else {
        console.log("Keine Kontakte gefunden");
    }    
}

loadContacts();