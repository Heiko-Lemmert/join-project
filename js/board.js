let currentTask = [];
let allTasks = [];
let toDoSection = [];
let inProgressSection = [];
let awaitFeedbackSection = [];
let doneSection = [];
let currentTaskName = [];
let openTask = [];
let currentFilterWord = '';

/**
 * Main render function to initialize tasks and UI components.
 */
function renderCode() {
    includeHTML();
    checkForList();
    dagAndDrop();
    checkForEmptyLists();
    initializeImageHover();
    loadAllTasks();
}

/**
 * Loads all tasks from the database and handles errors if loading fails.
 */
async function loadAllTasks() {
    allTasks = await getData('tasks').catch(error => {
        console.error("Error loading data:", error);
    });

    if (allTasks && Object.keys(allTasks).length > 0) {
        moveTask();
    } else {
        console.error("No tasks found or allTasks is not an object");
    }
}

/**
 * Resets the task section arrays to empty lists.
 */
function resetSectionArr() {
    toDoSection = [];
    inProgressSection = [];
    awaitFeedbackSection = [];
    doneSection = [];
}

/**
 * Moves tasks into their respective sections based on their progress status.
 */
function moveTask() {
    resetSectionArr();
    Object.keys(allTasks).forEach(taskKey => {
        currentTask = allTasks[taskKey];
        currentTask.databaseKey = taskKey;
        if (currentTask.progress === 'to-do') {
            toDoSection.push(currentTask);
        }
        if (currentTask.progress === 'in-progress') {
            inProgressSection.push(currentTask);
        }
        if (currentTask.progress === 'await-feedback') {
            awaitFeedbackSection.push(currentTask);
        }
        if (currentTask.progress === 'done') {
            doneSection.push(currentTask);
        }
    });
    renderBoard();
}

/**
 * Renders the main task board sections based on task progress.
 */
function renderBoard() {
    renderSection(toDoSection, 'left');
    renderSection(inProgressSection, 'leftNum2');
    renderSection(awaitFeedbackSection, 'right');
    renderSection(doneSection, 'rightNum2');
    checkForEmptyLists();
    dagAndDrop();
}

/**
 * Renders a specific section of tasks onto the board.
 * @param {Array} section - The section array containing tasks.
 * @param {string} id - The ID of the HTML element to render the section in.
 */
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
            }
            if (currentTask.contacts) {
                renderBoardTaskContacts(currentTask.contacts, whichSection, i, currentTask.contactColor);
            }
        });
    }
}

/**
 * Renders a counter for the number of completed subtasks in a task.
 * @param {Array} subtasks - Array of subtasks.
 * @param {string} section - The section identifier.
 * @param {number} i - Task index.
 */
function renderBoardSubtaskCounter(subtasks, section, i) {
    const boardSubtask = document.getElementById('boardSubtask-' + section + '-' + i);
    const subtaskLength = subtasks.length;
    let subtaskCounter = 0;
    subtasks.forEach(currentSubtask => {
        if (currentSubtask.done) {
            subtaskCounter++;
        }
    });
    const subtaskValue = (100 / subtaskLength) * subtaskCounter;
    boardSubtask.innerHTML = generateBoardSubtaskHTML(subtaskValue, subtaskCounter, subtaskLength);
}

/**
 * Renders contacts assigned to a task on the task card.
 * @param {Array} taskContacts - Array of contacts assigned to the task.
 * @param {string} section - The section identifier.
 * @param {number} index - Task index.
 * @param {Array} color - Array of colors representing each contact.
 */
function renderBoardTaskContacts(taskContacts, section, index, color) {
    const boardTaskContacts = document.getElementById('boardTaskContacts-' + section + '-' + index);
    taskContacts.forEach((contact, i) => {
        let contactColor = color[i];
        let contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += generateBoardTaskContactsHTML(contactsInitials, contactColor);
    });
}

/**
 * Chooses the priority image based on the task's priority level.
 * @param {string} prio - Task priority ('high', 'medium', 'low').
 * @returns {string} HTML string for the priority image.
 */
function prioImgChooser(prio) {
    switch (prio) {
        case 'high':
            return '<img class="task-card-prio" src="./assets/img/prio-high.png" alt=""></img>';
        case 'medium':
            return '<img class="task-card-prio-medium" src="./assets/img/prio-medium.png" alt=""></img>';
        case 'low':
            return '<img class="task-card-prio" src="./assets/img/prio-low.png" alt=""></img>';
        default:
            break;
    }
}

/**
 * Converts priority text to a capitalized string.
 * @param {string} prio - Task priority.
 * @returns {string} Capitalized priority string.
 */
function prioText(prio) {
    return prio.charAt(0).toUpperCase() + prio.slice(1);
}

/**
 * Chooses the banner HTML for a task based on its category.
 * @param {string} category - Task category.
 * @returns {string} HTML string for the category banner.
 */
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

/**
 * Determines the section name based on the section array.
 * @param {Array} section - The section array.
 * @returns {string} The section name as a string.
 */
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
 * Filters tasks based on a keyword input and renders filtered tasks.
 */
function filterAndShowTask() {
    let tasksArray = Object.values(allTasks);
    let filterInputElement = document.getElementById('filterTaskInput');
    currentFilterWord = filterInputElement.value.toLowerCase();

    if (currentFilterWord === '') {
        moveTask();
        return;
    }

    currentTaskName = tasksArray.filter(task => {
        return (task.title && task.title.toLowerCase().includes(currentFilterWord)) ||
               (task.description && task.description.toLowerCase().includes(currentFilterWord));
    });

    renderTasks();
    checkForEmptyLists();
}

/**
 * Renders filtered tasks onto the board.
 */
function renderTasks() {
    let leftContainer = document.getElementById('left');
    let leftNum2Container = document.getElementById('leftNum2');
    let rightContainer = document.getElementById('right');
    let rightNum2Container = document.getElementById('rightNum2');

    clearContainers([leftContainer, leftNum2Container, rightContainer, rightNum2Container]);
    let tasksToRender = getTasksToRender();

    tasksToRender.forEach((task, i) => {
        let taskHTML = createTaskHTML(task, i);
        renderTaskToSection(task.progress, taskHTML, task, i);
    });

    dagAndDrop();
}

/**
 * Clears the content of task containers.
 * @param {Array} containers - Array of container elements to clear.
 */
function clearContainers(containers) {
    containers.forEach(container => container.innerHTML = '');
}

/**
 * Gets tasks to render based on filter criteria.
 * @returns {Array} Array of tasks to render.
 */
function getTasksToRender() {
    return currentFilterWord ? currentTaskName : Object.values(allTasks);
}

/**
 * Creates the HTML for a task card based on task data.
 * @param {Object} task - The task object.
 * @param {number} index - Task index.
 * @returns {string} HTML string for the task card.
 */
function createTaskHTML(task, index) {
    let prioImg = prioImgChooser(task.prio);
    let categoryBanner = bannerChooser(task.category);
    let whichSection = task.progress;
    return generateBoardTasksHTML(task, categoryBanner, whichSection, index, prioImg);
}

/**
 * Renders a task to a specific section on the board.
 * @param {string} section - Section identifier.
 * @param {string} taskHTML - HTML content for the task.
 * @param {Object} task - Task data.
 * @param {number} index - Task index.
 */
function renderTaskToSection(section, taskHTML, task, index) {
    let container;
    switch (section) {
        case 'to-do':
            container = document.getElementById('left');
            break;
        case 'in-progress':
            container = document.getElementById('leftNum2');
            break;
        case 'await-feedback':
            container = document.getElementById('right');
            break;
        case 'done':
            container = document.getElementById('rightNum2');
            break;
    }
    container.innerHTML += taskHTML;
    renderTaskDetails(task, section, index);
}

/**
 * Renders additional details for a task, such as subtasks and contacts.
 * @param {Object} task - Task data.
 * @param {string} section - Section identifier.
 * @param {number} index - Task index.
 */
function renderTaskDetails(task, section, index) {
    if (task.subtask) {
        renderBoardSubtaskCounter(task.subtask, section, index);
    }
    if (task.contacts) {
        renderBoardTaskContacts(task.contacts, section, index, task.contactColor);
    }
}

/**
 * Checks for empty lists in the board and displays a message if a list is empty.
 */
function checkForEmptyLists() {
    let boxIds = ["left", "leftNum2", "right", "rightNum2"];
    for (let i = 0; i < boxIds.length; i++) {
        let box = document.getElementById(boxIds[i]);
        let lists = box.querySelectorAll(".list");
        let noTaskSpanList = box.querySelectorAll(".noTaskSpan");
        if (lists.length === 0) {
            if (noTaskSpanList.length > 0) {
                noTaskSpanList[0].style.display = "block";
            }
        } else {
            if (noTaskSpanList.length > 0) {
                noTaskSpanList[0].style.display = "none";
            }
        }
    }
}

/**
 * Sets up drag-and-drop functionality for tasks.
 */
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
            e.preventDefault();
            if (selected) {
                box.appendChild(selected);
                const selectedTask = JSON.parse(selected.dataset.task);
                selectedTask.progress = checkDropArea(selected.parentElement.id);
                updateData("tasks/" + selectedTask.databaseKey, selectedTask);
                selected = null;
                checkForEmptyLists();
                dagAndDrop();
            }
        });
    }
    setupDropArea(rightBox);
    setupDropArea(rightBoxNum2);
    setupDropArea(leftBox);
    setupDropArea(leftBoxNum2);
}

/**
 * Toggles the scroll behavior in the list area based on screen size.
 */
function checkForList() {
    let scrollDivs = document.querySelectorAll(".scroll-div");
    for (let i = 0; i < scrollDivs.length; i++) {
        let scrollDiv = scrollDivs[i];
        let lists = scrollDiv.querySelectorAll(".list");
        scrollDiv.style.overflowX = "hidden";
        scrollDiv.style.overflowY = "hidden";
        if (window.innerWidth <= 970) {
            if (lists.length <= 1) {
                scrollDiv.style.overflowX = "hidden";
            } else {
                scrollDiv.style.overflowX = "scroll";
            }
        } else if ((window.innerWidth > 970)) {
            if (lists.length <= 1) {
                scrollDiv.style.overflowY = "hidden";
            } else  {
                scrollDiv.style.overflowY = "hidden";
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', checkForList);
window.addEventListener('resize', checkForList);

/**
 * Determines the new progress state based on the drop area.
 * @param {string} column - Column ID where the task was dropped.
 * @returns {string} The updated progress state.
 */
function checkDropArea(column) {
    switch (column) {
        case 'left':
            return 'to-do';
        case 'leftNum2':
            return 'in-progress';
        case 'right':
            return 'await-feedback';
        case 'rightNum2':
            return 'done';
        default:
            break;
    }
}

/**
 * Shows or hides the task overlay based on task section.
 * @param {string} taskSection - The section of the task to show.
 */
function showOrHideOverlay(taskSection) {
    if (document.body.getAttribute('style') === 'visibility: visible; overflow: hidden;') {
        allowScrolling()
    } else {
        preventScrolling();
    }
    const atOverlay = document.getElementById('atOverlay');
    const script = document.scripts.namedItem('taskOnBoard');
    if (atOverlay.classList.contains('at-overlay-hidden')) {
        atOverlay.classList.toggle('at-overlay-hidden');
        if (!script || script.getAttribute('src') !== './js/add-task.js') {
            if (script) script.remove();
            loadExternalScript('./js/add-task.js', loadInitAddTask);
        }
    } else {
        atOverlay.classList.toggle('at-overlay-hidden');
    }
    progressStatus = taskSection;
}

/**
 * Initializes the 'Add Task' overlay UI and sets up event listeners.
 */
function loadInitAddTask() {
    const cancelBtn = document.getElementById('cancelBtn');
    const createBtn = document.getElementById('createBtn');
    initTask();
    cancelBtn.addEventListener('click', () => {
        showOrHideOverlay();
    });
    createBtn.addEventListener('click', () => {
        setTimeout(showOrHideOverlay, 1000);
        setTimeout(loadAllTasks, 1000);
    });
}

/**
 * Dynamically loads an external JavaScript file and runs a callback on load.
 * @param {string} src - Source URL of the script.
 * @param {function} callback - Function to call once the script loads.
 */
function loadExternalScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.id = 'taskOnBoard';
    script.onload = callback;
    document.head.appendChild(script);
}

/**
 * Opens a detailed view of a selected task.
 * @param {HTMLElement} element - The task element to open.
 */
function openList(element) {
    openTask = JSON.parse(element.getAttribute('data-task'));
    const content = document.getElementById('bigViewList');
    const categoryBanner = bannerChooser(openTask.category);
    const prioTextUpperCase = prioText(openTask.prio);
    const prioImg = prioImgChooser(openTask.prio);
    content.innerHTML = generateTaskCardHTML(categoryBanner, openTask, prioTextUpperCase, prioImg);
    if (openTask.subtask) {
        renderOverlaySubtask(openTask.subtask);
    }
    if (openTask.contacts) {
        renderOverlayTaskContacts(openTask.contacts, openTask.contactColor);
    }
    preventScrolling();
}

/**
 * Renders subtasks for the task overlay.
 * @param {Array} subtasks - Array of subtasks to render.
 */
function renderOverlaySubtask(subtasks) {
    currentSubtasks = subtasks;
    const boardSubtask = document.getElementById('overlaySubtask');
    boardSubtask.innerHTML = '<p>Subtasks</p>';
    subtasks.forEach((subtask, i) => {
        const checkImg = subtask.done ? 'check-btn-dark' : 'no-check-btn';
        boardSubtask.innerHTML += generateOverlaySubtaskHTML(checkImg, i, subtask);
    });
    overlaySubtaskEventlister(boardSubtask);
}

/**
 * Sets up event listeners for subtask completion checkboxes in the overlay.
 * @param {HTMLElement} id - The element containing subtasks.
 */
function overlaySubtaskEventlister(id) {
    const checkImgTag = id.querySelectorAll('img');
    checkImgTag.forEach(imgTag => {
        imgTag.addEventListener('click', event => {
            changeSubtaskStatus(event.target.id);
        });
    });
}

/**
 * Toggles the completion status of a subtask.
 * @param {number} index - The index of the subtask to toggle.
 */
function changeSubtaskStatus(index) {
    const status = openTask.subtask[index].done ? false : true;
    openTask.subtask[index].done = status;
    updateData("tasks/" + openTask.databaseKey, openTask);
    renderOverlaySubtask(openTask.subtask);
}

/**
 * Renders contacts associated with a task in the overlay.
 * @param {Array} taskContacts - Array of task contacts.
 * @param {Array} contactColor - Array of colors for each contact.
 */
function renderOverlayTaskContacts(taskContacts, contactColor) {
    const boardTaskContacts = document.getElementById('overlayTaskContacts');
    boardTaskContacts.innerHTML = '<p>Assigned To:</p>';
    taskContacts.forEach((contact, i) => {
        let color = contactColor[i];
        let contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += generateOverlayTaskContactsHTML(contactsInitials, contact, color);
    });
}

/**
 * Deletes a task from the database.
 * @param {string} dbObjectKey - Key of the task to delete.
 */
function deleteTask(dbObjectKey) {
    deleteData('tasks/' + dbObjectKey);
    showToast('deleteToast');
    setTimeout(closeViewList, 1500);
}

/**
 * Opens or closes the edit task overlay.
 */
function openOrCloseEditTask() {
    const etOverlay = document.getElementById('etOverlay');
    const script = document.scripts.namedItem('taskOnBoard');
    if (etOverlay.classList.contains('et-overlay-hidden')) {
        etOverlay.classList.toggle('et-overlay-hidden');
        if (!script || script.getAttribute('src') !== './js/edit-task.js') {
            if (script) script.remove();
            loadExternalScript('./js/edit-task.js', loadInitEditTask);
        } else {
            fillEditTask(openTask.databaseKey);
        }
    } else {
        etOverlay.classList.toggle('et-overlay-hidden');
    }
}

/**
 * Initializes the 'Edit Task' overlay UI and sets up event listeners.
 */
function loadInitEditTask() {
    const editBtn = document.getElementById('editBtn');
    initTask();
    editBtn.addEventListener('click', () => {
        setTimeout(openOrCloseEditTask, 1000);
        setTimeout(closeViewList, 1000);
    });
    fillEditTask(openTask.databaseKey);
}

/**
 * Closes the detailed view list and reloads tasks.
 */
function closeViewList() {
    document.getElementById('bigViewList').innerHTML = '';
    setTimeout(loadAllTasks, 500);
    allowScrolling();
}

/**
 * Initializes hover effects for images in task cards.
 */
function initializeImageHover() {
    const hoverImages = document.querySelectorAll('.hover-image');
    hoverImages.forEach(function (hoverImage) {
        hoverImage.addEventListener('mouseenter', function () {
            hoverImage.src = './assets/img/plusButton.transiction.png';
        });
        hoverImage.addEventListener('mouseleave', function () {
            hoverImage.src = './assets/img/plusButton.png';
        });
    });
}

/**
 * Highlights a draggable area when a task is dragged over it.
 * @param {string} id - The ID of the draggable area.
 */
function highlight(id) {
    const element = document.getElementById(id);
    element.classList.add('drag-area-highlight');
}

/**
 * Removes highlight from a draggable area.
 * @param {string} id - The ID of the draggable area.
 */
function removeHighlight(id) {
    const element = document.getElementById(id);
    element.classList.remove('drag-area-highlight');
}
