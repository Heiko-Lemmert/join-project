let currentTask = [];
let allTasks = [];
let toDoSection = [];
let inProgressSection = [];
let awaitFeedbackSection = [];
let doneSection = [];
let currentTaskName = [];
let openTask = [];
let currentFilterWord = '';

function renderCode() {
    includeHTML();
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

function renderBoard() {
    renderSection(toDoSection, 'left');
    renderSection(inProgressSection, 'leftNum2');
    renderSection(awaitFeedbackSection, 'right');
    renderSection(doneSection, 'rightNum2');
    checkForEmptyLists();
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
            }
            if (currentTask.contacts) {
                renderBoardTaskContacts(currentTask.contacts, whichSection, i, currentTask.contactColor);
            }
        });
    }
}

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

function renderBoardTaskContacts(taskContacts, section, index, color) {
    const boardTaskContacts = document.getElementById('boardTaskContacts-' + section + '-' + index);
    taskContacts.forEach((contact, i) => {
        let contactColor = color[i];
        let contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += generateBoardTaskContactsHTML(contactsInitials, contactColor);
    });
}

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

function prioText(prio) {
    return prio.charAt(0).toUpperCase() + prio.slice(1);
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

function clearContainers(containers) {
    containers.forEach(container => container.innerHTML = '');
}

function getTasksToRender() {
    return currentFilterWord ? currentTaskName : Object.values(allTasks);
}

function createTaskHTML(task, index) {
    let prioImg = prioImgChooser(task.prio);
    let categoryBanner = bannerChooser(task.category);
    let whichSection = task.progress;
    return generateBoardTasksHTML(task, categoryBanner, whichSection, index, prioImg);
}

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

function renderTaskDetails(task, section, index) {
    if (task.subtask) {
        renderBoardSubtaskCounter(task.subtask, section, index);
    }
    if (task.contacts) {
        renderBoardTaskContacts(task.contacts, section, index, task.contactColor);
    }
}

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
                // checkForList();
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

function loadExternalScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.id = 'taskOnBoard';
    script.onload = callback;
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
    }
    if (openTask.contacts) {
        renderOverlayTaskContacts(openTask.contacts, openTask.contactColor);
    }
    preventScrolling();
}

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

function overlaySubtaskEventlister(id) {
    const checkImgTag = id.querySelectorAll('img');
    checkImgTag.forEach(imgTag => {
        imgTag.addEventListener('click', event => {
            changeSubtaskStatus(event.target.id);
        });
    });
}

function changeSubtaskStatus(index) {
    const status = openTask.subtask[index].done ? false : true;
    openTask.subtask[index].done = status;
    updateData("tasks/" + openTask.databaseKey, openTask);
    renderOverlaySubtask(openTask.subtask);
}

function renderOverlayTaskContacts(taskContacts, contactColor) {
    const boardTaskContacts = document.getElementById('overlayTaskContacts');
    boardTaskContacts.innerHTML = '<p>Assigned To:</p>';
    taskContacts.forEach((contact, i) => {
        let color = contactColor[i];
        let contactsInitials = generateInitials(contact);
        boardTaskContacts.innerHTML += generateOverlayTaskContactsHTML(contactsInitials, contact, color);
    });
}

function deleteTask(dbObjectKey) {
    deleteData('tasks/' + dbObjectKey);
    showToast('deleteToast');
    setTimeout(closeViewList, 1500);
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
        setTimeout(closeViewList, 1000);
    });
    fillEditTask(openTask);
}

function closeViewList() {
    document.getElementById('bigViewList').innerHTML = '';
    setTimeout(loadAllTasks, 500);
    allowScrolling();
}

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

function highlight(id) {
    const element = document.getElementById(id);
    element.classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    const element = document.getElementById(id);
    element.classList.remove('drag-area-highlight');
}
