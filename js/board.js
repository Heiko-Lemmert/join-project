let currentTask = [];
let allTasks = [];
let toDoSection = [];
let inProgressSection = [];
let awaitFeedbackSection = [];
let doneSection = [];

function renderCode() {
    includeHTML();
    dagAndDrop();
    checkForEmptyLists();
    checkForList();
    initializeImageHover();
    loadAllTasks();
}

async function loadAllTasks() {//Lädt alle Aufgaben asynchron aus der Datenbank.
    allTasks = await getData('tasks').catch(error => {
        console.error("Error loading data:", error);
    }); // Auf Promise warten
    moveTask();
}

function moveTask() {
    Object.keys(allTasks).forEach(taskKey => {
        currentTask = allTasks[taskKey];
        currentTask.databaseKey = taskKey
        if (currentTask.progress === 'to-do') {
            toDoSection.push(currentTask)
        }
        if (currentTask.progress === 'in-progress') {
            inProgressSection.push(currentTask)
        }
        if (currentTask.progress === 'await-feedback') {
            awaitFeedbackSection.push(currentTask)
        }
        if (currentTask.progress === 'done') {
            doneSection.push(currentTask)
        }
    })
    renderBoard();
}

function renderBoard() {//Rendert jede Sektion des Boards (to-do, in-progress, await-feedback, done)
    renderSection(toDoSection, 'left');
    renderSection(inProgressSection, 'leftNum2');
    renderSection(awaitFeedbackSection, 'right');
    renderSection(doneSection, 'rightNum2');

    dagAndDrop();
    checkForEmptyLists(); // Überprüfe, ob Listen leer sind
}

function renderSection(section, id) {//  Rendert eine einzelne Sektion (z.B. to-do) auf dem Board und zeigt die Aufgaben an.   Falls Unteraufgaben oder Kontakte vorhanden sind, werden zusätzliche Funktionen aufgerufen
    const sectionArray = document.getElementById(id);
    const whichSection = sectionChooser(section);
    //sectionArray.innerHTML = '<span class="noTaskSpan">No tasks </span>'; auskommentiert weil es sonst den code von  board hindert
    if (section) {
        section.forEach((currentTask, i) => {
            const prioImg = prioImgChooser(currentTask.prio);
            const categoryBanner = bannerChooser(currentTask.category);
            sectionArray.innerHTML += `
                <div class="list" draggable="true" data-task='${JSON.stringify(currentTask)}' onclick="openList(this)">
                    <div class="task-card-category">${categoryBanner}</div>
                    <h3 class="task-card-title">${currentTask.title}</h3>
                    <p class="task-card-description">${currentTask.description}</p>
                    <div class="task-card-subtask" id="boardSubtask-${whichSection}-${i}">
                    </div>
                    <div class="task-card-bottom">
                        <div class="task-card-contacts" id="boardTaskContacts-${whichSection}-${i}"></div>
                        ${prioImg}
                    </div>
                </div>`;
            if (currentTask.subtask) {
                renderBoardSubtaskCounter(currentTask.subtask, whichSection, i);
            };
            if (currentTask.contacts) {
                renderBoardTaskContacts(currentTask.contacts, whichSection, i);
            };
        });
    }
}

function renderBoardSubtaskCounter(subtasks, section, i) {
    const boardSubtask = document.getElementById('boardSubtask-' + section + '-' + i);
    const subtaskLength = subtasks.length
    let subtaskCounter = 0;
    subtasks.forEach(currentSubtask => {
        if (currentSubtask.done) {
            subtaskCounter++
        }
    })
    const subtaskValue = (100 / subtaskLength) * subtaskCounter;
    boardSubtask.innerHTML = `
        <div class="subtask-container">
            <div class="subtask-value" style="width: ${subtaskValue}%"></div>
        </div>
        <div class="subtask-info">${subtaskCounter}/${subtaskLength} Subtasks</div>`
}

function renderBoardTaskContacts(taskContacts, section, i) {
    const boardTaskContacts = document.getElementById('boardTaskContacts-' + section + '-' + i);
    taskContacts.forEach(contact => {
        let contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += `<p class="contact-initials" style="background-color: ${getRandomColor()}">${contactsInitials}</p>`
    })
}

//Generiert Initialen für jeden Kontakt basierend auf dem Namen (z.B. "John Doe" → "JD").
function generateInitials(contact) {
    let initials = '';
    let splitString = contact.split(' ');
    splitString.forEach(name => {
        initials += name.charAt(0)
    });
    return initials;
}

//Wählt das entsprechende Prioritätsbild basierend auf der Priorität der Aufgabe (high, medium, low).
function prioImgChooser(prio) {
    switch (prio) {
        case 'high':
            return '<img class="task-card-prio" src="./assets/img/prio-high.png" alt=""></img>'
        case 'medium':
            return '<img class="task-card-prio-medium" src="./assets/img/prio-medium.png" alt=""></img>'
        case 'low':
            return '<img class="task-card-prio" src="./assets/img/prio-low.png" alt=""></img>'
        default:
            break;
    }
}

//Wählt das Banner für eine Aufgabe basierend auf ihrer Kategorie (User Story, Technical Task).
function bannerChooser(category) {
    switch (category) {
        case 'User Story':
            return '<span class="category-story">User Story</span>';
        case 'Technical Task':
            return '<span class="category-technical">Technical Task</span>';
        default:
            break;
    }
}

function sectionChooser(section) {
    switch (section) {
        case toDoSection:
            return 'to-do';
        case inProgressSection:
            return 'in-progress';
        case awaitFeedbackSection:
            return 'feedback';
        case doneSection:
            return 'done';
        default:
            break;
    }
}

/*
function filterAndShowNames() { //suchfunktion
    let filterWord = document.getElementById('filterTaskInput').value.toLowerCase();
    currentTaksName = loadAllTasks.filter( => .toLowerCase().includes(filterWord));
    renderTasks();
}


function renderTasks() { //rendern von gefilterten Tasks
    let container = document.getElementById('taskArea');
    container.innerHTML = '';
    for (let i = 0; i < currentTaksName.length; i++) {
        let task = currentTaksName[i];
        container.innerHTML += `
            <div class="list" draggable="true">
                <h3>${task.name}</h3>
                <p>${task.description}</p>
            </div>
          
        `;
    }
}

*/



// Funktion zur Überprüfung der Listen auf leere Inhalte
//Diese Funktion dient dazu, die Anzeige der Meldung "No tasks" zu steuern, je nachdem, ob in den jeweiligen Containern (div-Elementen) Aufgaben (list-Elemente) vorhanden sind oder nicht.
function checkForEmptyLists() {
    let boxIds = ["left", "leftNum2", "right", "rightNum2"];  //: Eine Variable, die ein Array von IDs speichert
    for (let i = 0; i < boxIds.length; i++) { //wir iterieren über die länge der variable
        let box = document.getElementById(boxIds[i]); //definieren eine variable , und holen uns das jeweilige id name des divs
        let lists = box.querySelectorAll(".list");//Findet alle Elemente innerhalb des aktuellen Containers (box), die die Klasse .list haben, und speichert sie als NodeList in der Variablen lists.

        //merken : noSpan div ist anfangs in css ausgeblendet
        let noTaskSpanList = box.querySelectorAll(".noTaskSpan");//struktur : let element = document.querySelectorAll('selector'); Erklärung : sucht innerhalb des Containers (box) nach alle Elemente, das die Klasse .noTaskSpan hat.
        //querySelector wird auf ein Dokument (document) oder ein bestimmtes Element angewendet und akzeptiert einen String als Parameter. Dieser String ist ein CSS-Selektor, der verwendet wird, um das gewünschte Element zu finden.
        if (lists.length === 0) { //Überprüft, ob die NodeList lists keine Aufgaben (list-Elemente) enthält (lists.length === 0).
            if (noTaskSpanList.length > 0) { //Was macht es?    Überprüft, ob es mindestens ein span-Element mit der Klasse .noTaskSpan im aktuellen Container gibt (noTaskSpanList.length > 0).
                noTaskSpanList[0].style.display = "block"; // Wenn ja, greift es auf das erste dieser Elemente zu (noTaskSpanList[0]) und setzt dessen CSS-Eigenschaft display auf "block", um die Meldung anzuzeigen.
            }
        } else { // Wenn Listen-Elemente vorhanden sind
            if (noTaskSpanList.length > 0) { // Überprüfe erneut, ob es mindestens ein "No tasks"-Element gibt
                noTaskSpanList[0].style.display = "none"; // Wenn ja, greift es auf das erste dieser Elemente zu (noTaskSpanList[0]) und setzt dessen CSS-Eigenschaft display auf "none", um die Meldung auszublenden.
            }
        }
    }

}
function checkForList() {
    // Wählen  alle Elemente mit der Klasse "scroll-div"
    let scrollDivs = document.querySelectorAll(".scroll-div");

    // Iterieren  über die ausgewählten Elemente
    for (let i = 0; i < scrollDivs.length; i++) {
        let scrollDiv = scrollDivs[i]; // Greifen Sie auf das aktuelle Element zu
        let lists = scrollDiv.querySelectorAll(".list"); // Suchen Sie nach '.list'-Elementen innerhalb dieses 'div'

        // Setze overflowX und overflowY zurück
        scrollDiv.style.overflowX = "hidden";
        scrollDiv.style.overflowY = "hidden";

        // Überprüft, ob keine '.list'-Elemente vorhanden sind
        if (window.innerWidth <= 970) {
            // Wenn die Bildschirmbreite kleiner oder gleich 970px ist
            if (lists.length === 0) {
                scrollDiv.style.overflowX = "hidden"; // Horizontale Scrollleiste entfernen
            } else {
                scrollDiv.style.overflowX = "scroll"; // Horizontale Scrollleiste hinzufügen
            }
        } else {
            // Wenn die Bildschirmbreite größer als 970px ist
            if (lists.length === 0) {
                scrollDiv.style.overflowY = "hidden"; // Vertikale Scrollleiste entfernen
            } else {
                scrollDiv.style.overflowY = "scroll"; // Vertikale Scrollleiste hinzufügen
            }
        }
    }
}

// Fügen Sie ein Event-Listener für die Größenänderung des Fensters hinzu
window.addEventListener('resize', checkForList);//Nutze Events wie resize und DOMContentLoaded: Stelle sicher, dass deine Funktionen, die auf Fenstergröße oder andere dynamische Änderungen reagieren sollen, immer an die entsprechenden Events gebunden sind


function dagAndDrop() {
    let lists = document.getElementsByClassName("list");
    let rightBox = document.getElementById("right");
    let leftBox = document.getElementById("left");
    let rightBoxNum2 = document.getElementById("rightNum2");
    let leftBoxNum2 = document.getElementById("leftNum2");
    let selected = null;

    for (let list of lists) {
        list.addEventListener("dragstart", function (e) {
            selected = e.target;
        });
    }

    function setupDropArea(box) {
        box.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        box.addEventListener("drop", function (e) {
            box.appendChild(selected);
            selected = null;
            checkForList();//die Funktion checkForList() nach dem Verschieben der Liste erneut aufrufen, damit die Scrollleisten in beiden div-Elementen aktualisiert werden
            checkForEmptyLists();
        });
    }


    setupDropArea(rightBox);
    setupDropArea(rightBoxNum2);
    setupDropArea(leftBox);
    setupDropArea(leftBoxNum2);
}

//Zeigt oder versteckt das Overlay zum Erstellen oder Bearbeiten einer Aufgabe.
function showOrHideOverlay() {
    const atOverlay = document.getElementById('atOverlay');
    const cancelBtn = document.getElementById('cancelBtn');
    const createBtn = document.getElementById('createBtn');
    atOverlay.classList.toggle('at-overlay-hidden');
    if (document.scripts.namedItem('addTaskOnBoard') === null) {
        loadExternalScript('./js/add-task.js', () => {
            initTask();
            cancelBtn.addEventListener('click', () => {
                showOrHideOverlay()
            });
            createBtn.addEventListener('click', () => {
                setTimeout(showOrHideOverlay, 1000);
            });
        })
    }
}

//Lädt ein externes Skript (z.B. für das Erstellen einer neuen Aufgabe) und führt eine Callback-Funktion nach dem Laden aus.
function loadExternalScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.id = 'addTaskOnBoard'
    script.onload = callback; // Optional: eine Funktion, die nach dem Laden ausgeführt wird
    document.head.appendChild(script);
}

//Öffnet eine detaillierte Ansicht einer Aufgabe, zeigt Titel, Beschreibung, Datum, Priorität, Unteraufgaben und Kontakte an.
function openList(element) {
    const task = JSON.parse(element.getAttribute('data-task'));
    const content = document.getElementById('bigViewList');
    const categoryBanner = bannerChooser(task.category);
    const prioImg = prioImgChooser(task.prio);
    content.innerHTML = `
     <div class="background-bigListView">
               <div class="inner-bigListView">
                    <div class="content-bigListView">
                        <div class="top-content-bigListView">
                            <div class="task-card-overlay-top">
                                <div class="task-card-overlay-category">${categoryBanner}</div>
                                <img src="./assets/img/close.png" alt="close" onclick="closeViewList()">
                            </div>
                            <h3 class="task-card-overlay-title">${task.title}</h3>
                            <p class="task-card-overlay-description">${task.description}</p>
                            <p class="task-card-overlay-date">Due date: ${task.date}</p>
                            <p class="task-card-overlay-prio">Priority: ${prioImg}</p>
                            <div class="task-card-contacts" id="overlayTaskContacts"></div>
                            <div class="task-card-subtask" id="overlaySubtask"></div>
                            <div class="task-card-overlay-bottom">
                                <img class="overlay-action-btn btn-delete" src="./assets/img/board-delete.png" alt=""></img>
                                <hr>
                                <img class="overlay-action-btn btn-edit" src="./assets/img/board-edit.png" alt=""></img>
                            </div>
                        </div>
                    </div>
               </div>
            </div>    
    `;
    if (task.subtask) { // wenn aufgabe eine subtask hat ((task)siehe oben in der variable initialisiert)
        renderOverlaySubtask(task.subtask); // dann wird die funktion aufgerufen 
    };
    if (task.contacts) {
        renderOverlayTaskContacts(task.contacts);
    };
}
//Die Anzahl der gesamten und der erledigten Unteraufgaben wird berechnet
//subtasks: Ein Array, das die Unteraufgaben der Aufgabe enthält.
function renderOverlaySubtask(subtasks) {
    const boardSubtask = document.getElementById('overlaySubtask');
    const subtaskLength = subtasks.length
    let subtaskCounter = 0;
    //durch alle unteraufgaben iteriert und für jede wenn sie fertig ist um ein erhöht
    subtasks.forEach(currentSubtask => {
        if (currentSubtask.done) {
            subtaskCounter++
        }
    })
    //Der Fortschritt der Unteraufgaben wird als Prozentsatz dargestellt
    const subtaskValue = (100 / subtaskLength) * subtaskCounter;
    //werden im HTML als Fortschrittsbalken und Text angezeigt.
    boardSubtask.innerHTML = `
        <div class="subtask-container">
            <div class="subtask-value" style="width: ${subtaskValue}%"></div>
        </div>
        <div class="subtask-info">${subtaskCounter}/${subtaskLength} Subtasks</div>`
}
//Diese Funktion zeigt die Kontakte der Aufgabe im Overlay an.
//taskContacts: Ein Array, das die Kontakte der Aufgabe enthält.
function renderOverlayTaskContacts(taskContacts) {
    const boardTaskContacts = document.getElementById('overlayTaskContacts');
    taskContacts.forEach(contact => {
        let contactsInitials = generateInitials(contact);//Die Initialen werden mit der Funktion generateInitials generiert
        boardTaskContacts.innerHTML += `<p class="contact-initials" style="background-color: ${getRandomColor()}">${contactsInitials}</p>`//Eine zufällige Hintergrundfarbe wird für jede Initialen-Karte verwendet (mittels getRandomColor).
    })
}


function closeViewList() {
    document.getElementById('bigViewList').innerHTML = '';
}

//style
function initializeImageHover() {
    // Finde alle Bild-Elemente mit der Klasse 'hover-image'
    const hoverImages = document.querySelectorAll('.hover-image');

    // Durchlaufe alle gefundenen Bild-Elemente
    hoverImages.forEach(function (hoverImage) {
        // Füge einen Event-Listener hinzu, der auf das "mouseenter" Event hört
        hoverImage.addEventListener('mouseenter', function () {
            hoverImage.src = './assets/img/plusButton.transiction.png'; // Bildquelle ändern, wenn die Maus darüber schwebt
        });

        // Füge einen Event-Listener hinzu, der auf das "mouseleave" Event hört
        hoverImage.addEventListener('mouseleave', function () {
            hoverImage.src = './assets/img/plusButton.png'; // Ursprüngliche Bildquelle wiederherstellen, wenn die Maus das Bild verlässt
        });
    });
}

// Stelle sicher, dass die Funktion beim Laden der Seite aufgerufen wird

