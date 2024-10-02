const BASE_URL = "https://join-89-default-rtdb.europe-west1.firebasedatabase.app/";

async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json(); 
}

async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json(); 
}

async function updateData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json(); 
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json(); 
}

postData('contacts', [
    {
        "email": "max.mueller@example.com",
        "name": "Max Müller",
        "number": 15510123456
    },
    {
        "email": "anna.schmidt@example.com",
        "name": "Anna Schmidt",
        "number": 15510234567
    },
    {
        "email": "luca.meier@example.com",
        "name": "Luca Meier",
        "number": 15510345678
    },
    {
        "email": "laura.schneider@example.com",
        "name": "Laura Schneider",
        "number": 15510456789
    },
    {
        "email": "philipp.schulz@example.com",
        "name": "Philipp Schulz",
        "number": 15510567890
    },
    {
        "email": "emilia.wagner@example.com",
        "name": "Emilia Wagner",
        "number": 15510678901
    },
    {
        "email": "felix.hoffmann@example.com",
        "name": "Felix Hoffmann",
        "number": 15510789012
    },
    {
        "email": "sofia.klein@example.com",
        "name": "Sofia Klein",
        "number": 15510890123
    },
    {
        "email": "noah.fischer@example.com",
        "name": "Noah Fischer",
        "number": 15510901234
    },
    {
        "email": "hanna.weber@example.com",
        "name": "Hanna Weber",
        "number": 15511012345
    }
]);
