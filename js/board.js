let currentTask = [];
let allTasks = [];
let toDoSection = [];
let inProgressSection = [];
let awaitFeedbackSection = [];
let doneSection = [];
let currentTaskName = [];
let openTask = [];

function renderCode() {
    includeHTML();
    checkForList();
    dagAndDrop();
    checkForEmptyLists();
    initializeImageHover();
    loadAllTasks();
}

async function loadAllTasks() {
    allTasks = await getData('tasks').catch(error => {
        console.error("Error loading data:", error);
    });

    if (allTasks && Object.keys(allTasks).length > 0) {
        moveTask();
        checkForList();//sichergestellt, dass die Funktion erst dann ausgeführt wird, wenn die Aufgaben tatsächlich im DOM vorhanden sind. Dadurch konnte die Scrollleiste korrekt aktiviert werden, da nun Inhalt vorhanden war, den sie scrollen musste.
    } else {
        console.error("No tasks found or allTasks is not an object");
    }
}


function resetSectionArr() {
    toDoSection = [];
    inProgressSection = [];
    awaitFeedbackSection = [];
    doneSection = [];
}

function moveTask() {
    resetSectionArr();
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
    checkForEmptyLists(); // Überprüfe, ob Listen leer sind
    dagAndDrop();
}

function renderSection(section, id) {
    const sectionArray = document.getElementById(id);
    const whichSection = sectionChooser(section);
    sectionArray.innerHTML = `<span class="noTaskSpan">No tasks in ${whichSection}</span>`;
    

    if (section) {
        section.forEach((currentTask, i) => {
            const prioImg = prioImgChooser(currentTask.prio);
            const categoryBanner = bannerChooser(currentTask.category);
            sectionArray.innerHTML += generateBoardTasksHTML(currentTask, categoryBanner, whichSection, i, prioImg);
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
    boardSubtask.innerHTML = generateBoardSubtaskHTML(subtaskValue, subtaskCounter, subtaskLength);
}

function renderBoardTaskContacts(taskContacts, section, i) {
    const boardTaskContacts = document.getElementById('boardTaskContacts-' + section + '-' + i);
    taskContacts.forEach(contact => {
        let contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += generateBoardTaskContactsHTML(contactsInitials);
    })
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

function prioText(prio) {
    return prio.charAt(0).toUpperCase() + prio.slice(1)
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
/**
 * it is filtering the searched input
 */
function filterAndShowTask() {
    // Wandelt das allTasks-Objekt in ein Array von Aufgaben um
    let tasksArray = Object.values(allTasks);

    let filterInputElement = document.getElementById('filterTaskInput');

    let filterWord = filterInputElement.value.toLowerCase();

    // Filtere die Aufgaben basierend auf dem Titel oder der Beschreibung
    currentTaskName = tasksArray.filter(task => {
        return (task.title && task.title.toLowerCase().includes(filterWord)) ||
            (task.description && task.description.toLowerCase().includes(filterWord));
    });


    // Gefilterte Aufgaben rendern
    renderTasks();
    
}


function renderTasks() {
    let leftContainer = document.getElementById('left');
    let leftNum2Container = document.getElementById('leftNum2');
    let rightContainer = document.getElementById('right');
    let rightNum2Container = document.getElementById('rightNum2');

    // Leere alle Container
    leftContainer.innerHTML = '';
    leftNum2Container.innerHTML = '';
    rightContainer.innerHTML = '';
    rightNum2Container.innerHTML = '';

    // Verwende entweder gefilterte Aufgaben oder alle Aufgaben, wenn kein Filter aktiv ist
    let tasksToRender = currentTaskName.length > 0 ? currentTaskName : Object.values(allTasks);

    tasksToRender.forEach((task, i) => {
        let prioImg = prioImgChooser(task.prio);
        let categoryBanner = bannerChooser(task.category);
        let whichSection = task.progress;  // Nutze den "progress"-Wert direkt, da `sectionChooser` eine Funktion benötigt

        let taskHTML = generateBoardTasksHTML(task, categoryBanner, whichSection, i, prioImg);

        // Aufgabe in die entsprechende Section einfügen
        switch (task.progress) {
            case 'to-do':
                leftContainer.innerHTML += taskHTML;
                break;
            case 'in-progress':
                leftNum2Container.innerHTML += taskHTML;
                break;
            case 'await-feedback':
                rightContainer.innerHTML += taskHTML;
                break;
            case 'done':
                rightNum2Container.innerHTML += taskHTML;
                break;
        }
    });
}

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
            if (lists.length <= 1) {
                scrollDiv.style.overflowX = "hidden"; // Horizontale Scrollleiste entfernen
            } else {
                scrollDiv.style.overflowX = "scroll"; // Horizontale Scrollleiste hinzufügen
            }
        } else if ((window.innerWidth > 970)) {
            // Wenn die Bildschirmbreite größer als 970px ist
            if (lists.length <= 1) {
                scrollDiv.style.overflowY = "hidden"; // Vertikale Scrollleiste entfernen
            } else {
                scrollDiv.style.overflowY = "scroll"; // Vertikale Scrollleiste hinzufügen
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', checkForList);

// Fügen Sie ein Event-Listener für die Größenänderung des Fensters hinzu
window.addEventListener('resize', checkForList);//Nutze Events wie resize und DOMContentLoaded: Stelle sicher, dass deine Funktionen, die auf Fenstergröße oder andere dynamische Änderungen reagieren sollen, immer an die entsprechenden Events gebunden sind

function dagAndDrop() {
    let lists = document.getElementsByClassName("list");
    let rightBox = document.getElementById("right");
    let leftBox = document.getElementById("left");
    let rightBoxNum2 = document.getElementById("rightNum2");
    let leftBoxNum2 = document.getElementById("leftNum2");
    let selected = null;

    // Setze EventListener auf alle list-Elemente
    for (let list of lists) {
        list.addEventListener("dragstart", function (e) {
            selected = e.target; // Speichert das gezogene Element
        });
    }

    function setupDropArea(box, boxId) {
        box.addEventListener("dragover", function (e) {
            e.preventDefault(); // Verhindert das Standardverhalten
        });

        box.addEventListener("dragleave", function (e) {
            

        });

        box.addEventListener("drop", function (e) {
            e.preventDefault(); // Verhindert das Standardverhalten
            if (selected) {
                box.appendChild(selected); // Element dem Zielbereich hinzufügen
                const selectedTask = JSON.parse(selected.dataset.task); // Task-Objekt in JSON umwandeln
                selectedTask.progress = checkDropArea(selected.parentElement.id);
                updateData("tasks/" + selectedTask.databaseKey, selectedTask);
                selected = null;
                checkForList();
                checkForEmptyLists();
             

            } 
            
        });
    }

    setupDropArea(rightBox, 'right');
    setupDropArea(rightBoxNum2, 'rightNum2');
    setupDropArea(leftBox, 'left');
    setupDropArea(leftBoxNum2, 'leftNum2');
}



function checkDropArea(column) {
    switch (column) {
        case 'left':
            return 'to-do'
        case 'leftNum2':
            return 'in-progress'
        case 'right':
            return 'await-feedback'
        case 'rightNum2':
            return 'done'
        default:
            break;
    }
}

function showOrHideOverlay() {
    const atOverlay = document.getElementById('atOverlay');
    const script = document.scripts.namedItem('taskOnBoard');
    if (atOverlay.classList.contains('at-overlay-hidden')) {
        atOverlay.classList.toggle('at-overlay-hidden')
        if (!script || script.getAttribute('src') !== './js/add-task.js') {
            if (script) script.remove();
            loadExternalScript('./js/add-task.js', loadInitAddTask);
        }
    } else {
        atOverlay.classList.toggle('at-overlay-hidden');
    }
}

function loadInitAddTask() {
    const cancelBtn = document.getElementById('cancelBtn');
    const createBtn = document.getElementById('createBtn');
    initTask();
    cancelBtn.addEventListener('click', () => {
        showOrHideOverlay()
    });
    createBtn.addEventListener('click', () => {
        setTimeout(showOrHideOverlay, 1000);
        setTimeout(loadAllTasks, 1000);
    });

}

function loadExternalScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.id = 'taskOnBoard'
    script.onload = callback; // Optional: eine Funktion, die nach dem Laden ausgeführt wird
    document.head.appendChild(script);
}


function openList(element) {
    openTask = JSON.parse(element.getAttribute('data-task'));
    const content = document.getElementById('bigViewList');
    const categoryBanner = bannerChooser(openTask.category);
    const prioTextUpperCase = prioText(openTask.prio);
    const prioImg = prioImgChooser(openTask.prio);
    content.innerHTML = generateTaskCardHTML(categoryBanner, openTask, prioTextUpperCase, prioImg);
    if (openTask.subtask) {
        renderOverlaySubtask(openTask.subtask);
    };
    if (openTask.contacts) {
        renderOverlayTaskContacts(openTask.contacts);
    };

}

function renderOverlaySubtask(subtasks) {
    currentSubtasks = subtasks;
    const boardSubtask = document.getElementById('overlaySubtask');
    boardSubtask.innerHTML = '<p>Subtasks</p>'
    subtasks.forEach((subtask, i) => {
        const checkImg = subtask.done ? 'check-btn-dark' : 'no-check-btn';
        boardSubtask.innerHTML += generateOverlaySubtaskHTML(checkImg, i, subtask);
    })
    overlaySubtaskEventlister(boardSubtask);
}

function overlaySubtaskEventlister(id) {
    const checkImgTag = id.querySelectorAll('img');
    checkImgTag.forEach(imgTag => {
        imgTag.addEventListener('click', event => {
            changeSubtaskStatus(event.target.id);
        })
    })
}

function changeSubtaskStatus(index) {
    const status = openTask.subtask[index].done ? false : true;
    openTask.subtask[index].done = status;
    updateData("tasks/" + openTask.databaseKey, openTask);
    renderOverlaySubtask(openTask.subtask);
}

function renderOverlayTaskContacts(taskContacts) {
    const boardTaskContacts = document.getElementById('overlayTaskContacts');
    boardTaskContacts.innerHTML = '<p>Assigned To:</p>'
    taskContacts.forEach(contact => {
        let contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += generateOverlayTaskContactsHTML(contactsInitials, contact);
    })
}

function deleteTask(dbObjectKey) {
    deleteData('tasks/' + dbObjectKey);
    showToast('deleteToast');
    setTimeout(closeViewList, 1000);
}

function openOrCloseEditTask() {
    const etOverlay = document.getElementById('etOverlay');
    const script = document.scripts.namedItem('taskOnBoard');
    if (etOverlay.classList.contains('et-overlay-hidden')) {
        etOverlay.classList.toggle('et-overlay-hidden');
        if (!script || script.getAttribute('src') !== './js/edit-task.js') {
            if (script) script.remove();
            loadExternalScript('./js/edit-task.js', loadInitEditTask);
        } else {
            fillEditTask(openTask);
        }
    } else {
        etOverlay.classList.toggle('et-overlay-hidden');
    }
}

function loadInitEditTask() {
    const editBtn = document.getElementById('editBtn');
    initTask();
    editBtn.addEventListener('click', () => {
        setTimeout(openOrCloseEditTask, 1000);
    })
    fillEditTask(openTask);
}

function closeViewList() {
    document.getElementById('bigViewList').innerHTML = '';
    loadAllTasks();
}

/**
 * This function is used to change the image if the User click on it
 */
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

function highlight(id) {
    const element = document.getElementById(id);
    element.classList.add('drag-area-highlight');

}

function removeHighlight(id) {
    const element = document.getElementById(id);
    element.classList.remove('drag-area-highlight');

}
