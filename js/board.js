let currentTask = [];
let allTasks = [];
let toDoSection = [];
let inProgressSection = [];
let awaitFeedbackSection = [];
let doneSection = [];

function renderCode() {
    dagAndDrop();
    checkForEmptyLists();
    checkForList();
    initializeImageHover();
    includeHTML();
    loadAllTasks();
}

async function loadAllTasks() {
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

function renderBoard() {
    renderSection(toDoSection, 'left');
    renderSection(inProgressSection, 'leftNum2');
    renderSection(awaitFeedbackSection, 'right');
    renderSection(doneSection, 'rightNum2');
}

function renderSection(section, id) {
    const sectionArray = document.getElementById(id);
    const whichSection = sectionChooser(section);
    sectionArray.innerHTML = '<span class="noTaskSpan">No tasks in to do</span>';
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

function generateInitials(contact) {
    let initials = '';
    let splitString = contact.split(' ');
    splitString.forEach(name => {
        initials += name.charAt(0)
    });
    return initials;
}

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
function checkForEmptyLists() {         //Diese Funktion dient dazu, die Anzeige der Meldung "No tasks" zu steuern, je nachdem, ob in den jeweiligen Containern (div-Elementen) Aufgaben (list-Elemente) vorhanden sind oder nicht.
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
    // Wählen Sie alle Elemente mit der Klasse "scroll-div"
    let scrollDivs = document.querySelectorAll(".scroll-div");

    // Iterieren Sie über die ausgewählten Elemente
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


function openList(element) {
    const task = JSON.parse(element.getAttribute('data-task'));
    const content = document.getElementById('bigViewList');
    const categoryBanner = bannerChooser(task.category);
    const prioImg = prioImgChooser(task.prio);
    console.log(task)
    content.innerHTML = `
     <div class="background-bigListView">
               <div class="inner-bigListView">
                    <div class="content-bigListView">
                        <div class="top-content-bigListView">
                            <div class="task-card-overlay-top">
                                <div class="task-card-overlay-category">${categoryBanner}</div>
                                <span class="close-bigListView-button" onclick="closeViewList()"> X </span>
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
    if (task.subtask) {
        renderOverlaySubtask(task.subtask);
    };
    if (task.contacts) {
        renderOverlayTaskContacts(task.contacts);
    };
}

function renderOverlaySubtask(subtasks) {
    const boardSubtask = document.getElementById('overlaySubtask');
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

function renderOverlayTaskContacts(taskContacts) {
    const boardTaskContacts = document.getElementById('overlayTaskContacts');
    taskContacts.forEach(contact => {
        let contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += `<p class="contact-initials" style="background-color: ${getRandomColor()}">${contactsInitials}</p>`
    })
}

function closeViewList() {
    document.getElementById('bigViewList').innerHTML = '';
}

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

