
const currentDate = new Date();
let currentHour = currentDate.getHours();
let taskArray = [];

function init() {
    setWelcomeText();
    loadTasks();
}

function setWelcomeText() {
    const welcomeText = document.getElementById('welcomeText');
    if (currentHour >= 6 && currentHour <= 11) {
        welcomeText.innerText = 'Good Morning,';
    } else if (currentHour >= 12 && currentHour <= 17) {
        welcomeText.innerText = 'Good Afternoon,';
    } else if (currentHour >= 18 && currentHour <= 22) {
        welcomeText.innerText = 'Good Evening,';
    } else {
        welcomeText.innerText = 'Good Night,';
    }
}
async function getData(key) {
    const url = `https://join-89-default-rtdb.europe-west1.firebasedatabase.app/${key}.json`; // Firebase-URL
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function loadTasks() {
    const tasks = await getData("tasks");
    console.log("Loaded tasks:", tasks); // Debug-Ausgabe zur Kontrolle der geladenen Aufgaben
    taskArray = Object.values(tasks); // Verarbeite die geladene Aufgabenliste
    renderTask(); // Aufgabe rendern
}
function renderTask() {
    let taskSection = document.getElementById('sum-sct');
    taskSection.innerHTML = '';
    let totalTaskCount = 0;
    let doneCount = 0;
    let toDoCount = 0;
    let progressCount = 0;
    let feedBackCount = 0;
    let urgentPrio = 0;
    let deadLineField = [];
    let minField = null; // minField außerhalb des Blocks initialisieren

    for (let i = 0; i < taskArray.length; i++) {
        const taskCount = Array.isArray(taskArray[i].tasks) ? taskArray[i].tasks.length : 1;
        totalTaskCount += taskCount;
        let dateField = taskArray[i].date;

        if (taskArray[i].progress == "in-progress") {
            progressCount++;
        }
        if (taskArray[i].progress == "to-do") {
            toDoCount++;
        }
        if (taskArray[i].progress == "await-feedback") {
            feedBackCount++;
        }
        if (taskArray[i].progress == "done") {
            doneCount++;
        }
        if (taskArray[i].prio == "high") {
            urgentPrio++;
            deadLineField.push(Date.parse(dateField));  // Datum in Millisekunden umwandeln
            minField = new Date(Math.min(...deadLineField));  // Den frühesten Termin finden und zurück in ein Datum konvertieren
        }
    }

    // MinField überprüfen, bevor es im HTML verwendet wird
    const upcomingDeadline = minField ? minField.toLocaleDateString() : "No deadlines";

    taskSection.innerHTML += `
    <section class="summary-section">
        <header class="summary-header">
            <h1>Join 360</h1>
            <hr>
            <h2>Key Metrics at a Glance</h2>
        </header>
        <div class="summary-container">
            <div class="summary-container-left">
                <div class="summary-task-top">
                    <a href="./board.html" class="summary-task-btn st-todo">
                        <div>
                            <p class="st-number">${toDoCount}</p>
                            <p>To-Do</p>
                        </div>
                    </a>
                    <a href="./board.html" class="summary-task-btn st-done">
                        <div>
                            <p class="st-number">${doneCount}</p>
                            <p>Done</p>
                        </div>
                    </a>
                </div>
                <div class="summary-task-middle">
                    <a href="./board.html" class="summary-task-btn st-info">
                        <div class="st-info-left">
                            <div>
                                <p class="st-number">${urgentPrio}</p>
                                <p>Urgent</p>
                            </div>
                        </div>
                        <hr>
                        <div class="st-info-right">
                            <div class="st-info-right-inner-content">
                                <p>${upcomingDeadline}</p>
                                <p>Upcoming Deadline</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="summary-task-bottom">
                    <a href="./board.html" class="summary-task-btn st-in-board">
                        <p class="st-number">${totalTaskCount}</p>
                        <p>Task in Board</p>
                    </a>
                    <a href="./board.html" class="summary-task-btn st-in-progress">
                        <p class="st-number">${progressCount}</p>
                        <p>Task in Progress</p>
                    </a>
                    <a href="./board.html" class="summary-task-btn st-feedback">
                        <p class="st-number">${feedBackCount}</p>
                        <p>Awaiting Feedback</p>
                    </a>
                </div>
            </div>
        </div>
    </section>`;
}
