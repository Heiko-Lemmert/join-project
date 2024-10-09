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

async function login() {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;

    try {
        let data = await getData("users");
        let usersArray = Object.values(data);
        let userFound = false;

        for (const user of usersArray) {
            if (user.email === email && user.password.toString() === password) {
                userFound = true;
                window.location.href = "summary.html"; 
                break; 
            }
        }

        if (!userFound) {
            alert('Check your email and password. Please try again.');
        }

    } catch (error) {
        console.error("Fehler beim Login:", error);
    }
}

async function showUsers() {
    let users = await getData('users');
    console.log(users);
}

showUsers();

function validate(email, name, password, confirmPassword) {
    if (!email || !name || !password || !confirmPassword) {
        alert('Bitte fülle alle Felder aus.');
        return; 
    }

    if (password !== confirmPassword) {
        alert('Die Passwörter stimmen nicht überein. Bitte versuche es erneut.');
        return;
    }
    
    if (document.getElementById('privacy-policy').checked) {
        return true;
    } else {
        alert('Bitte akzeptiere die Datenschutzrichtlinie.');
        return false;
    }
}

async function signUpUser() {
    const email = document.getElementById("email-input").value;
    const name = document.getElementById("name-input").value;
    const password = document.getElementById("password-input").value;
    const confirmPassword = document.getElementById("confirm-password-input").value;

    if (!validate(email, name, password, confirmPassword)) {
        return;
    }

    const newUserData = {
        email: email,
        name: name,
        password: password
    };

    try {
        let data = await getData("users");
        let usersArray = Object.values(data);

        if (!usersArray) {
            usersArray = [];
        }

        usersArray.push(newUserData);

        await updateData('users', usersArray);
        window.location.href = "summary.html"; 

    } catch (error) {
        console.error('Fehler beim Registrieren des Benutzers:', error);
    }
}