const BASE_URL = "https://join-89-default-rtdb.europe-west1.firebasedatabase.app/";

async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

async function login() {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;

    try {
        let data = await getData("users");
        let usersArray = Object.values(data)[0];
        let userFound = false;

        for (const user of usersArray) {
            if (user.email === email && user.password.toString() === password) {
                userFound = true;
                console.log("Login erfolgreich!");
                window.location.href = "summary.html"; 
                break; 
            }
        }

        if (!userFound) {
            console.log("Fehler beim Login: Benutzer nicht gefunden oder falsches Passwort.");
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
