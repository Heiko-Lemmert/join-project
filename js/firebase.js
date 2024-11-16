const BASE_URL = "https://join-89-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data from a specified path in the Firebase database.
 * 
 * @async
 * @param {string} [path=""] - The path to fetch data from in the database.
 * @returns {Promise<Object>} - Returns a promise that resolves to the fetched data as a JSON object.
 */
async function getData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Posts new data to a specified path in the Firebase database.
 * 
 * @async
 * @param {string} [path=""] - The path to post data to in the database.
 * @param {Object} [data={}] - The data object to be posted.
 * @returns {Promise<Object>} - Returns a promise that resolves to the response data as a JSON object.
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
 * Deletes data at a specified path in the Firebase database.
 * 
 * @async
 * @param {string} [path=""] - The path to delete data from in the database.
 * @returns {Promise<Object>} - Returns a promise that resolves to the response data as a JSON object.
 */
async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}

/**
 * Updates data at a specified path in the Firebase database using the PUT method.
 * 
 * @async
 * @param {string} [path=""] - The path to update data in the database.
 * @param {Object} [data={}] - The updated data object to be sent.
 * @returns {Promise<Object>} - Returns a promise that resolves to the response data as a JSON object.
 */async function updateData(path = "", data = {}, timeout = 10000) {
    const controller = new AbortController();
    const signal = controller.signal;

   
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        //console.log("Updating data at:", BASE_URL + path + ".json");

        const response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            signal: signal
        });

        clearTimeout(timeoutId); // Lösche das Timeout, wenn die Anfrage erfolgreich war

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const responseToJson = await response.json();
        return responseToJson;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Die Anfrage wurde abgebrochen (Timeout).");
        } else {
            console.error("Fehler beim Aktualisieren der Daten:", error);
        }
        throw error;
    }
}
