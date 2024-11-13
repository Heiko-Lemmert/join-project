/**
 * Base URL for Firebase Realtime Database.
 */
const BASE_URL = "https://join-89-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data from the specified path in the Firebase database.
 * @param {string} path - The path in the database to retrieve data from.
 * @returns {Promise<Object>} The data retrieved from the database.
 */
async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Sends data to the specified path in the Firebase database.
 * @param {string} path - The path in the database where data will be added.
 * @param {Object} data - The data to send to the database.
 * @returns {Promise<Object>} The response data from the database.
 */
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

/**
 * Updates data at the specified path in the Firebase database.
 * @param {string} path - The path in the database to update data.
 * @param {Object} data - The new data to update in the database.
 * @returns {Promise<Object>} The updated data from the database.
 */
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

/**
 * Handles user login by checking email and password with stored user data.
 */
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
                localStorage.setItem("currentUser", JSON.stringify(user.name));
                window.location.href = "summary.html";
                break;
            }
        }
        if (!userFound) {
            whichValueIsFalseLogin();
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

/**
 * Retrieves and displays all users from the database.
 */
async function showUsers() {
    let users = await getData('users');
}

showUsers();

/**
 * Logs in as a guest by storing guest data in local storage.
 */
async function guestLogin() {
    const user = 'Guest';
    localStorage.setItem("currentUser", JSON.stringify(user));
}

/**
 * Registers a new user by validating input, creating user data, 
 * and adding it to the Firebase database.
 */
async function signUpUser() {
    const email = document.getElementById("email-input").value;
    const name = document.getElementById("name-input").value;
    const password = document.getElementById("password-input").value;
    const confirmPassword = document.getElementById("confirm-password-input").value;
    const isValid = validateForm();

    if (isValid) {
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
            console.error('Error registering user:', error);
        }
    } else {
        whichValueIsFalseSigin()
    }
}

/**
 * Handles the loading animation sequence on page start.
 */
function loader() {
    document.querySelector('.startsequence').style.opacity = '0';
    document.querySelector('.logo-start').classList.add('logo')
    setTimeout(() => {
        document.querySelector('.startsequence').style.display = 'none';
    }, 1500);
}

/**
 * Validates form input for signing up by checking for valid values.
 * @returns {boolean} True if the form inputs are valid, false otherwise.
 */
function validateForm() {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const passwordConfirm = document.getElementById('confirm-password-input').value;
    const checkMail = isValidEmail(email);

    if (name && checkMail && password && passwordConfirm) {
        return true
    }
}

/**
 * Shows an error message and highlights incorrect fields during login.
 */
function whichValueIsFalseLogin() {
    const password = document.getElementById('password-input');
    const mail = document.getElementById('email-input');
    const none = document.getElementById('wrong-login');
    password.classList.add('required-border');
    mail.classList.add('required-border');
    none.classList.remove('d-none');
    setTimeout(() => {
        password.classList.remove('required-border');
        mail.classList.remove('required-border');
        none.classList.add('d-none');
    }, 1500)
}

/**
 * Shows error messages and highlights incorrect fields during sign-up.
 */
function whichValueIsFalseSigin() {
    const name = document.getElementById('name-input');
    const email = document.getElementById('email-input');
    const password = document.getElementById('password-input');
    const passwordConfirm = document.getElementById('confirm-password-input');
    const checkbox = document.getElementById('privacy-policy');
    const checkMail = isValidEmail(email.value);

    if (!name.value) {
        name.classList.add('required-border');
    }
    if (!checkMail) {
        email.classList.add('required-border');
    }
    if (!isSamePassword()) {
        passwordConfirm.classList.add('required-border');
        password.classList.add('required-border');
    }
    if (!checkbox.checked) {
        document.getElementById('checkPrivacy').classList.add('required-underline');
    } 
    setTimeout(() => {
        name.classList.remove('required-border');
        email.classList.remove('required-border');
        password.classList.remove('required-border');
        passwordConfirm.classList.remove('required-border');
        document.getElementById('checkPrivacy').classList.remove('required-underline');
    }, 1500)
}

/**
 * Checks if the email format is valid.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Compares password and confirmation password for equality.
 * @returns {boolean} True if passwords match, false otherwise.
 */
function isSamePassword() {
    const password = document.getElementById('password-input').value;
    const passwordConfirm = document.getElementById('confirm-password-input').value;
    if (password.length > 0 && passwordConfirm.length > 0) {
        const result = password.localeCompare(passwordConfirm);
        if (result == 0) {
            return true
        } else {
            return false
        }
    } else {return false}
}
