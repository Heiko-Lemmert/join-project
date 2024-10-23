/* Board HTML */


function generateBoardTasksHTML(currentTask, categoryBanner, whichSection, i, prioImg) {
    if (currentTask && Object.keys(currentTask).length > 0) {
        // Generiere das HTML für die Aufgabe

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
    } else {
        console.error('Current task data is missing or invalid.');
    }

}

function generateBoardSubtaskHTML(subtaskValue, subtaskCounter, subtaskLength) {
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

function generateTaskCardHTML(categoryBanner, openTask, prioTextUpperCase, prioImg) {
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
            <h1 class="wlcName" id="welcomeName">Guest</h1>
           </div>
        </div>
    </section>`
}

/* Task HTML */

function generateTaskContacts(contactName, contactsInitials) {
    return `
        <div class="contact-option">
            <div class="contact-initials" style="background-color: ${getRandomColor()}">${contactsInitials}</div>
            <label>${contactName}</label>
            <img src="./assets/img/no-check-btn.png" alt="Check" class="check-icon" id="checkIcon">
        </div>`
}

function generateSubtaksHTML(dotMarker, subtask, i) {
    return `
        <div class="new-subtask" contenteditable="true">
            <p>${dotMarker} ${subtask.title}</p>
            <div class="new-subtask-btn">
                <img src="./assets/img/edit-subtask.png" onclick="editSubtask(${i})" alt="Edit">
                <img src="./assets/img/delete-subtask.png" onclick="deleteSubtask(${i})" alt="Delete">
            </div>
            <div class="edit-field" id="edit-${i}">
                <input name="" value="${subtask.title}" id="editTaskField-${i}">
                <div class="edit-field-btn">
                    <img src="./assets/img/delete-subtask.png" onclick="deleteSubtask(${i})" alt="Delete">
                    <hr>
                    <img src="./assets/img/check-addtask.png" alt="Enter" onclick="editSubtaskArry(${i})">
                </div>
            </div>
        </div>`
}

/* Main HTML */

function generateHeaderHTML() {
    return `
        <div class="infoBox">
            <span class="infoBox-Header-text"> <a href="./legal-notice.html" id="legalNotice"></a>Legal Notice</span>
            <span class="infoBox-Header-text"><a href="./privacy-policy.html" id="privacyPolicy"></a>Privacy Policy</span>
            <span class="infoBox-Header-text" onclick="logout()">Log Out</span>
        </div>
    `
}

/* Contact HTML */

function generateFirstLetterHTML(currentLetter) {
    return `
        <div class="contact-letter-section">
            <span class="contact-section-letter">${currentLetter}</span>
            <span><hr class="contact-divider"></span>
        </div>
    `
}

function generateContactHTML(index, bgColor, initials, contact) {
    return `
        <div class="contact-item" onclick="showContactDetails(${index})">
            <div class="contact-avatar" style="background-color: ${bgColor}; color: white;">
                ${initials}
            </div>
            <div class="contact-info">
                <span class="contact-name">${contact.name}</span>
                <span class="contact-email">${contact.email}</span>
            </div>
        </div>`;
}

function generateContactDetailsHTML(bgColor, initials, contact) {
    return `
        <div class="card-mainDivv">
            <div class="profile-section">
               <div class="profile-higher-section">
                  <!-- Initialen anstelle eines Bildes, mit zufälliger Hintergrundfarbe -->
                  <div class="profile-img" style="background-color: ${bgColor}; color: white; border-radius: 50%; 
                      width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 36px;">
                      ${initials}
                  </div>
                  <img src="./assets/img/back-arrow.svg" alt="" class="back-contact-arrow" onclick="arrowDeleteContact()">
               </div>
               <div class="contact-name">
                    <h1 class="profile-name">${contact.name}</h1>
                    <div class="profile-actions">
                        <a href="#" class="profile-edit" onclick="toggleOverlay(); renderDialog();">Edit</a>
                        <a href="#" class="profile-delete">Delete</a>
                    </div>
                </div>
            </div>
            <div class="contact-details">
                <h2 class="details-heading">Contact Information</h2>
                <p class="contact-label"><strong>Email</strong></p>
                <a href="#" class="contact-email">${contact.email}</a>
                <p class="contact-label"><strong>Phone</strong></p>
                <a href="#" class="contact-phone">${contact.number}</a>
            </div>
        </div>
    `
}

function generateContactDialogHTML() {
    return `
        <div id="dialog" onclick="preventEventBubbling(event)">
            <div class="contact-form-description">
                <img src="./assets/img/Capa 2 (1).png">
                <h2>Add contact</h2>
                <p>Tasks are better with a team!</p>
            </div>
            <div class="contact-form">
                <img src="./assets/img/Frame 79.png" class="profile-image">
                <div class="contact-form-text">
                    <input type="text" placeholder="Name" class="name-input" id="name-input">
                    <img src="" alt="" class="email-icon">
                    <input type="email" placeholder="Email" class="email-input" id="email-input">
                    <img src="" alt="" class="phone-icon">
                    <input type="tel" placeholder="Phone" class="phone-input" id="phone-input">
                    <div class="button-container">
                        <button class="cancel-button" onclick="toggleOverlay();">Cancel</button>
                        <button class="create-contact-button" onclick="addContact();">Create contact</button>
                    </div>
                </div>
            </div>
        </div>`
}