
let currentDate = new Date();
let currentHour = currentDate.getHours();
let taskArray = [];

function init() {
    setWelcomeText();
    loadTasks();
}

function setWelcomeText() {
    let welcomeText = document.getElementById('welcomeText');
    let welcomeName = document.getElementById('welcomeName');
    console.log('Setting welcome text...');
    if (welcomeText) {
        console.log('Element found:', welcomeText);
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
        console.log('Text set to:', welcomeText.innerText);
    } else {
        console.error("Element with ID 'welcomeText' not found.");
    }
}

// Ein weiteres Logging direkt vor dem Laden des Templates
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');
    w3.includeHTML(function () {
        console.log('HTML templates included');
        setTimeout(function () {
            init();
            generateInitialsForHeader();
            console.log('init function called after timeout');
        }, 100);
    });
});


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

    taskSection.innerHTML = ''; // Leert den vorhandenen Inhalt
    let totalTaskCount = 0;
    let doneCount = 0;
    let toDoCount = 0;
    let progressCount = 0;
    let feedBackCount = 0;
    let urgentPrio = 0;
    let deadLineField = [];
    let minField = null;

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

    // Dynamisches Einfügen des HTMLs
    taskSection.innerHTML += generateSummaryHTML(toDoCount, doneCount, urgentPrio, upcomingDeadline, totalTaskCount, progressCount, feedBackCount);

    // **setWelcomeText() aufrufen, nachdem das HTML eingefügt wurde**
    setWelcomeText();
}
