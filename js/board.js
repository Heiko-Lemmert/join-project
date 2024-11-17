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
 * Resets the task section arrays to empty lists.
 */
function resetSectionArr() {
    toDoSection = [];
    inProgressSection = [];
    awaitFeedbackSection = [];
    doneSection = [];
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
 * Deletes a task from the database.
 * @param {string} dbObjectKey - Key of the task to delete.
 */
function deleteTask(dbObjectKey) {
    deleteData('tasks/' + dbObjectKey);
    showToast('deleteToast');
    setTimeout(closeViewList, 1500);
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
 * Closes the detailed view list and reloads tasks.
 */
function closeViewList() {
    document.getElementById('bigViewList').innerHTML = '';
    setTimeout(loadAllTasks, 500);
    allowScrolling();
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
 * Clears the content of task containers.
 * @param {Array} containers - Array of container elements to clear.
 */
function clearContainers(containers) {
    containers.forEach(container => container.innerHTML = '');
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