/* Board HTML */

function generateBoardTasksHTML(currentTask, categoryBanner, whichSection, i, prioImg) {
    return `
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
        </div>
        `
}

function generateBoardSubtaskHTML(subtaskValue, subtaskCounter,subtaskLength) {
    return `
        <div class="subtask-container">
            <div class="subtask-value" style="width: ${subtaskValue}%"></div>
        </div>
        <div class="subtask-info">${subtaskCounter}/${subtaskLength} Subtasks</div>
        `
}

function generateBoardTaskContactsHTML(contactsInitials) {
    return `<p class="contact-initials" style="background-color: ${getRandomColor()}">${contactsInitials}</p>`
}

function generateTaskCardHTML(categoryBanner, openTask,prioTextUpperCase, prioImg) {
    return `
        <div class="background-bigListView">
        <div class="inner-bigListView">
            <div class="content-bigListView">
                <div class="top-content-bigListView">
                    <div class="task-card-overlay-top">
                        <div class="task-card-overlay-category">${categoryBanner}</div>
                        <img src="./assets/img/close.png" alt="close" onclick="closeViewList()">
                    </div>
                    <h3 class="task-card-overlay-title">${openTask.title}</h3>
                    <p class="task-card-overlay-description">${openTask.description}</p>
                    <p class="task-card-overlay-date">Due date: ${openTask.date}</p>
                    <p class="task-card-overlay-prio">Priority: ${prioTextUpperCase} ${prioImg}</p>
                    <div class="task-card-contacts tc-column" id="overlayTaskContacts"></div>
                    <div class="task-card-subtask-overlay" id="overlaySubtask"></div>
                    <div class="task-card-overlay-bottom">
                        <img class="overlay-action-btn btn-delete" src="./assets/img/board-delete.png" alt=""
                            onclick="deleteTask('${openTask.databaseKey}')"></img>
                        <hr>
                        <img class="overlay-action-btn btn-edit" src="./assets/img/board-edit.png" alt=""
                            onclick="openOrCloseEditTask()"></img>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="deleteToast" class="toast-message">Task delete</div>
    `
}

function generateOverlaySubtaskHTML(checkImg, i, subtask) {
    return `
        <div class="st-overlay">
            <img src="./assets/img/${checkImg}.png" alt="${checkImg}" id="${i}">
            <p>${subtask.title}
        </div>
        `
}

function generateOverlayTaskContactsHTML(contactsInitials, contact) {
    return `
        <div class="tc-overlay">
            <p class="contact-initials" style="background-color: ${getRandomColor()}">${contactsInitials}</p>
            <p>${contact}</p>
        </div>
        `
}

/* Summary HTML */

function generateSummaryHTML(toDoCount, doneCount, urgentPrio, upcomingDeadline, totalTaskCount, progressCount, feedBackCount) {
    return `
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
          <div class="welcm-Section" >
            <h2 class="wlcText" id="welcomeText">Moin</h2>
            <h1 class="wlcName">Guest</h1>
           </div>
        </div>
    </section>`
}