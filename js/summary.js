/**
 * Initializes the current date and extracts the current hour for greeting purposes.
 */
let currentDate = new Date();
let currentHour = currentDate.getHours();

/**
 * Array to store tasks loaded from the database.
 */
let taskArray = [];

/**
 * Initializes the app by loading tasks and preparing the task view.
 */
function init() {
    loadTasks();
}

/**
 * Sets a welcome text based on the current hour of the day and the user's name.
 * Displays a different greeting depending on the time (morning, afternoon, evening, or night).
 */
function setWelcomeText() {
    let welcomeText = document.getElementById('welcomeText');
    let welcomeName = document.getElementById('welcomeName');
    if (welcomeText) {
        if (currentHour >= 6 && currentHour <= 11) {
            welcomeText.innerText = 'Good Morning,';
        } else if (currentHour >= 12 && currentHour <= 17) {
            welcomeText.innerText = 'Good Afternoon,';
        } else if (currentHour >= 18 && currentHour <= 22) {
            welcomeText.innerText = 'Good Evening,';
        } else {
            welcomeText.innerText = 'Good Night,';
        }
        welcomeName.innerText = JSON.parse(localStorage.getItem('currentUser'))
    } else {
        console.error("Element with ID 'welcomeText' not found.");
    }
}

/**
 * Executes on page load. Includes HTML templates and initializes the app after a short delay.
 */
document.addEventListener('DOMContentLoaded', function () {
    w3.includeHTML(function () {
        setTimeout(function () {
            init();
            generateInitialsForHeader();
        }, 100);
    });
});

/**
 * Retrieves data from the Firebase database using the specified key.
 * @param {string} key - The key path to fetch data from the database.
 * @returns {Promise<Object>} - The data retrieved from the database.
 */
async function getData(key) {
    const url = `https://join-89-default-rtdb.europe-west1.firebasedatabase.app/${key}.json`; // Firebase URL
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

/**
 * Loads tasks from the database into `taskArray` and renders the tasks on the page.
 */
async function loadTasks() {
    const tasks = await getData("tasks");
    taskArray = Object.values(tasks); // Processes the loaded task list
    renderTask(); // Renders tasks on the page
}

/**
 * Renders the tasks into a specific section on the page, calculates task statistics,
 * and displays an upcoming deadline if available.
 */
function renderTask() {
    let taskSection = document.getElementById('sum-sct');
    taskSection.innerHTML = ''; // Clears existing content

    // Task statistics counters
    let totalTaskCount = 0;
    let doneCount = 0;
    let toDoCount = 0;
    let progressCount = 0;
    let feedBackCount = 0;
    let urgentPrio = 0;
    let deadLineField = [];
    let minField = null;

    // Calculate task counts and earliest deadline based on task attributes
    for (let i = 0; i < taskArray.length; i++) {
        let taskCount = Array.isArray(taskArray[i].tasks) ? taskArray[i].tasks.length : 1;
        totalTaskCount += taskCount;
        let dateField = taskArray[i].date;

        if (taskArray[i].progress === "in-progress") {
            progressCount++;
        }
        if (taskArray[i].progress === "to-do") {
            toDoCount++;
        }
        if (taskArray[i].progress === "await-feedback") {
            feedBackCount++;
        }
        if (taskArray[i].progress === "done") {
            doneCount++;
        }
        if (taskArray[i].prio === "high") {
            urgentPrio++;
            deadLineField.push(Date.parse(dateField));  // Convert date to milliseconds
            minField = new Date(Math.min(...deadLineField));  // Find the earliest date
        }
    }

    // Check if minField exists before using it in HTML
    const upcomingDeadline = minField ? minField.toLocaleDateString() : "No deadlines";

    // Dynamically insert summary HTML with task statistics
    taskSection.innerHTML += generateSummaryHTML(toDoCount, doneCount, urgentPrio, upcomingDeadline, totalTaskCount, progressCount, feedBackCount);

    // Call setWelcomeText() after HTML is inserted
    setWelcomeText();
}
