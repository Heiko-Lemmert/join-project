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
    checkForList();
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
 * Renders contacts assigned to a task on the task card. Displays only up to 4 contacts and adds "+N" if there are more.
 * @param {Array} taskContacts - Array of contacts assigned to the task.
 * @param {string} section - The section identifier.
 * @param {number} index - Task index.
 * @param {Array} color - Array of colors representing each contact.
 */
function renderBoardTaskContacts(taskContacts, section, index, color) {
    const boardTaskContacts = document.getElementById('boardTaskContacts-' + section + '-' + index);
    boardTaskContacts.innerHTML = '';

    const maxVisibleContacts = 4;
    const totalContacts = taskContacts.length;

    for (let i = 0; i < Math.min(maxVisibleContacts, totalContacts); i++) {
        const contact = taskContacts[i];
        const contactColor = color[i];
        const contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += generateBoardTaskContactsHTML(contactsInitials, contactColor);
    }

    if (totalContacts > maxVisibleContacts) {
        const extraContacts = totalContacts - maxVisibleContacts;
        boardTaskContacts.innerHTML += `
            <div class="contact-circle extra-contacts">
                +${extraContacts}
            </div>
        `;
    }
}

/**
 * Gets tasks to render based on filter criteria.
 * @returns {Array} Array of tasks to render.
 */
function getTasksToRender() {
    return currentFilterWord ? currentTaskName : Object.values(allTasks);
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