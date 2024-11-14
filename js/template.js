/* Board HTML */

/**
 * Generates the HTML structure for a task on the board.
 * 
 * @param {Object} currentTask - The current task data.
 * @param {string} categoryBanner - The category banner HTML.
 * @param {string} whichSection - The section identifier (e.g., "todo", "in-progress").
 * @param {number} i - The index of the task.
 * @param {string} prioImg - The priority image HTML.
 * @returns {string} - The HTML string for the board task.
 */
function generateBoardTasksHTML(currentTask, categoryBanner, whichSection, i, prioImg) {
    if (currentTask && Object.keys(currentTask).length > 0) {
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

/**
 * Generates the HTML structure for a subtask progress bar.
 * 
 * @param {number} subtaskValue - The progress value of the subtask (percentage).
 * @param {number} subtaskCounter - The number of completed subtasks.
 * @param {number} subtaskLength - The total number of subtasks.
 * @returns {string} - The HTML string for the subtask progress.
 */
function generateBoardSubtaskHTML(subtaskValue, subtaskCounter, subtaskLength) {
    return `
        <div class="subtask-container">
            <div class="subtask-value" style="width: ${subtaskValue}%"></div>
        </div>
        <div class="subtask-info">${subtaskCounter}/${subtaskLength} Subtasks</div>
        `
}

/**
 * Generates the HTML for task contacts' initials with color background.
 * 
 * @param {string} contactsInitials - The initials of the contact.
 * @param {string} contactColor - The background color of the contact initials.
 * @returns {string} - The HTML string for contact initials.
 */
function generateBoardTaskContactsHTML(contactsInitials, contactColor) {
    return `<p class="contact-initials ci-margin" style="background-color: ${contactColor}">${contactsInitials}</p>`
}


/**
 * Generates the detailed task card overlay HTML.
 * 
 * @param {string} categoryBanner - The HTML for the category banner.
 * @param {Object} openTask - The task data to be displayed.
 * @param {string} prioTextUpperCase - The priority text in uppercase.
 * @param {string} prioImg - The HTML for the priority image.
 * @returns {string} - The HTML string for the task card overlay.
 */
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


/**
 * Generates the HTML for a subtask in the overlay view.
 * 
 * @param {string} checkImg - The name of the check image file (checked or unchecked).
 * @param {number} i - The index of the subtask.
 * @param {Object} subtask - The subtask data.
 * @returns {string} - The HTML string for the subtask overlay.
 */
function generateOverlaySubtaskHTML(checkImg, i, subtask) {
    return `
        <div class="st-overlay">
            <img src="./assets/img/${checkImg}.png" alt="${checkImg}" id="${i}">
            <p>${subtask.title}
        </div>
        `
}

/**
 * Generates the HTML for a contact in the overlay view.
 * 
 * @param {string} contactsInitials - The initials of the contact.
 * @param {string} contact - The full name of the contact.
 * @param {string} color - The background color for the contact initials.
 * @returns {string} - The HTML string for the overlay contact.
 */
function generateOverlayTaskContactsHTML(contactsInitials, contact, color) {
    return `
        <div class="tc-overlay">
            <p class="contact-initials" style="background-color: ${color}">${contactsInitials}</p>
            <p>${contact}</p>
        </div>
        `
}

/* Summary HTML */

/**
 * Generates the HTML structure for the summary section on the dashboard.
 * 
 * @param {number} toDoCount - The count of tasks in the "To-Do" state.
 * @param {number} doneCount - The count of completed tasks.
 * @param {number} urgentPrio - The count of tasks marked as urgent.
 * @param {string} upcomingDeadline - The next upcoming deadline.
 * @param {number} totalTaskCount - The total number of tasks in the board.
 * @param {number} progressCount - The count of tasks in progress.
 * @param {number} feedBackCount - The count of tasks awaiting feedback.
 * @returns {string} - The HTML string for the summary section.
 */
function generateSummaryHTML(toDoCount, doneCount, urgentPrio, upcomingDeadline, totalTaskCount, progressCount, feedBackCount) {
    return `
    <section class="summary-section content-size">
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

/**
 * Generates the HTML for a task contact option with initials and a checkbox icon.
 * 
 * @param {string} contactName - The full name of the contact.
 * @param {string} contactsInitials - The initials of the contact.
 * @param {string} contactColor - The background color for the contact initials.
 * @returns {string} - The HTML string for the task contact option.
 */
function generateTaskContacts(contactName, contactsInitials, contactColor) {
    return `
        <div class="contact-option">
            <div class="contact-initials" style="background-color: ${contactColor}">${contactsInitials}</div>
            <label>${contactName}</label>
            <img src="./assets/img/no-check-btn.png" alt="Check" class="check-icon" id="checkIcon">
        </div>`
}

/**
 * Generates the HTML for a subtask item in the task view.
 * 
 * @param {string} dotMarker - The marker or bullet symbol for the subtask.
 * @param {Object} subtask - The subtask data.
 * @param {number} i - The index of the subtask.
 * @returns {string} - The HTML string for the subtask item.
 */
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

/**
 * Generates the HTML for the main header with legal and privacy links.
 * 
 * @returns {string} - The HTML string for the header section.
 */
function generateHeaderHTML() {
    return `
        <div class="infoBox">
            <span class="infoBox-Header-text">
                <a class="infoBox-href-text"  href="./legal-notice.html" id="legalNotice">Legal Notice</a>
            </span>
            <span class="infoBox-Header-text">
                <a class="infoBox-href-text" href="./privacy-policy.html" id="privacyPolicy">Privacy Policy</a>
            </span>
            <span class="infoBox-Header-text" onclick="logout()">Log Out</span>
        </div>
    `;
}


/* Contact HTML */

/**
 * Generates the HTML for the contact section divider with the current letter.
 * 
 * @param {string} currentLetter - The first letter of the contact names in the section.
 * @returns {string} - The HTML string for the contact section divider.
 */
function generateFirstLetterHTML(currentLetter) {
    return `
        <div class="contact-letter-section">
            <span class="contact-section-letter">${currentLetter}</span>
            <span><hr class="contact-divider"></span>
        </div>
    `
}

/**
 * Generates the HTML for a contact item in the contact list.
 * 
 * @param {number} index - The index of the contact in the list.
 * @param {string} bgColor - The background color for the contact avatar.
 * @param {string} initials - The initials of the contact.
 * @param {Object} contact - The contact data (name and email).
 * @returns {string} - The HTML string for the contact item.
 */
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

/**
 * Generates the HTML template for displaying contact details.
 * @param {number} index - The index of the contact in the `contactArray`.
 * @returns {string} HTML template string for the contact details view.
 */

function contactDetailsTemplate(index) {
    let contact = contactArray[index];
    let initials = generateInitials(contact.name);
    let bgColor = contact.color;

    return `          
        <div class="card-mainDivv">
            <div class="profile-section">
               <div class="profile-higher-section">
                  <div class="profile-img" style="background-color: ${bgColor}; color: white; border-radius: 50%; 
                      width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 36px;">
                      ${initials}
                  </div>
                  <img src="./assets/img/back-arrow.svg" alt="" class="back-contact-arrow" onclick="arrowDeleteContact()">
               </div>
               <div class="contact-name">
                    <h1 class="profile-name">${contact.name}</h1>
                    <div class="profile-actions">
                        <a href="#" class="profile-edit" onclick="toggleOverlay(); renderDialog(${index});">Edit</a>
                        <a href="#" class="profile-delete" onclick="deleteContact(${index});">Delete</a>
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
        </div>`;
}

/**
 * Generates the HTML template for the contact dialog form.
 * Displays a form for either editing an existing contact or adding a new contact.
 * 
 * @param {Object} contact - The contact object to be edited (null for adding a new contact).
 * @param {number|null} index - The index of the contact in the contact array (null for adding a new contact).
 * @returns {string} - The HTML string for the contact form dialog.
 */
function getDialogTemplate(contact, index = null) {
    const title = contact ? 'Edit contact' : 'Add contact';
    const buttonText = contact ? 'Save' : 'Create contact';

    return `<div id="dialog" onclick="preventEventBubbling(event)">
        <div class="contact-form-description">
            <img src="./assets/img/Capa 2 (1).png">
            <h2>${title}</h2>
            <p>Tasks are better with a team!</p>
        </div>
        <div class="contact-form">
            <img src="./assets/img/Frame 79.png" class="profile-image">
            <div class="contact-form-text">
                <input type="text" placeholder="Name" required class="name-input" id="name-input" value="${contact ? contact.name : ''}">
                <input type="email" placeholder="Email" required class="email-input" id="email-input" value="${contact ? contact.email : ''}">
                <input type="tel" placeholder="Phone" required class="phone-input" id="phone-input" value="${contact ? contact.number : ''}">
                <div class="button-container">
                    <button class="cancel-button" onclick="toggleOverlay();">Cancel</button>
                    <button class="create-contact-button" onclick="${contact ? `saveContact(${index})` : 'addContact()'}">${buttonText}</button>
                </div>
            </div>
        </div>
    </div>`;
}