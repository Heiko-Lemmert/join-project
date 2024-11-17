(function () {
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskDate = document.getElementById('taskDate');
    const contactSelector = document.getElementById('contactSelector');
    const taskSelector = document.getElementById('taskSelector');
    const selectedContacts = document.getElementById('selectedContacts');
    const contactSearch = document.getElementById('contactSearch');
    const enhanceBtn = document.getElementById('enhanceBtn');
    const addSubtask = document.getElementById('addSubtask');
    const subtask = document.getElementById('subtask');
    const addBtn = document.getElementById('addBtn');
    const dotMarker = '&bull;';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("taskDate").setAttribute("min", today);
    let writtenSubtask = [];
    let selected = [];
    let selectedContactName = [];
    let selectedContactColor = [];
    let currentPrio = 'medium';
    let category = '';
    let contacts = [];

    /**
     * Initializes the task module by including HTML and loading contacts.
     */
    function initTask() {
        includeHTML();
        loadContacts();
    }

    /**
     * Loads contacts from the database and renders them in the contact selector.
     * @async
     */
    async function loadContacts() {
        const loadedContacts = await getData("contacts");
        contacts = Object.values(loadedContacts)[0];
        renderTaskContact();
        attachEventListeners(); // Event-Listener erst nach dem Rendern der Kontakte hinzufügen
    }

    /**
     * Renders the contact options sorted alphabetically in the contact selector dropdown.
     */
    function renderTaskContact() {
        contacts.sort((a, b) => a.name.localeCompare(b.name));
        const contactOptions = document.getElementById('contactOptions');
        contacts.forEach(contact => {
            const contactsInitials = generateInitials(contact.name);
            contactOptions.innerHTML += generateTaskContacts(contact.name, contactsInitials, contact.color);
        });
    }

    /**
     * Attaches event listeners for contact selection, task category selection, and subtask interactions.
     */
    function attachEventListeners() {
        contactEventLister();
        taskEventlister();
        subtaskEventlister();
    }

    /**
     * Handles click events for contact options in the contact selector dropdown.
     */
    function contactEventLister() {
        const contactOptions = document.getElementById('contactOptions');
        const contactOptionsDivs = contactOptions.querySelectorAll('.contact-option');

        contactOptionsDivs.forEach(optionDiv => {
            optionDiv.addEventListener('click', () => {
                checkOptionDiv(optionDiv);
                updateSelectedContacts(); // Update selected contacts
            });
        });

        contactSelector.addEventListener('click', () => {
            contactSelector.classList.toggle('field-activ');
            contactSelector.querySelector('img').classList.toggle('arrow-rotate');
            contactOptions.style.display = contactOptions.style.display === 'block' ? 'none' : 'block';
            contactSearch.style.display = contactSearch.style.display === 'block' ? 'none' : 'block';
        });
    };

    /**
     * Toggles the selection state of a contact option.
     * @param {HTMLElement} optionDiv - The div element of the contact option.
     */
    function checkOptionDiv(optionDiv) {
        const checkIcon = optionDiv.querySelector('.check-icon');
        const isSelected = checkIcon.getAttribute('src') === './assets/img/check-btn.png';
        checkIcon.setAttribute('src', isSelected ? './assets/img/no-check-btn.png' : './assets/img/check-btn.png');
        optionDiv.classList.toggle('sc-check');
    }

    /**
     * Handles click events for selecting a task category.
     */
    function taskEventlister() {
        const taskOptions = document.getElementById('taskOptions');
        const taskOptionsDivs = taskOptions.querySelectorAll('.task-option');

        taskSelector.addEventListener('click', () => {
            taskOptions.style.display = taskOptions.style.display === 'block' ? 'none' : 'block';
            if (taskSelector.innerText === 'Select task category') {
                taskSelector.querySelector('img').classList.toggle('arrow-rotate');
            }
        })

        taskOptionsDivs.forEach(taskDiv => {
            taskDiv.addEventListener('click', event => {
                taskSelector.textContent = '';
                taskSelector.textContent = event.target.innerText;
                category = event.target.innerText;
            })
        })
    }


    /**
     * Updates the list of selected contacts based on user selection.
     */
    function updateSelectedContacts() {
        const contactOptions = document.getElementById('contactOptions');
        selected = [];
        selectedContactName = [];
        selectedContactColor = [];

        contactOptions.querySelectorAll('.contact-option').forEach(optionDiv => {
            const checkIcon = optionDiv.querySelector('.check-icon');
            if (checkIcon.getAttribute('src') === './assets/img/check-btn.png') {
                const textLabel = optionDiv.querySelector('label').textContent;
                const textContent = optionDiv.querySelector('.contact-initials').textContent;
                const getStyle = optionDiv.querySelector('.contact-initials').getAttribute('style');
                const colorMatch = getStyle.match(/background-color:\s*(#[0-9A-Fa-f]{6})/);
                const colorHex = colorMatch ? colorMatch[1] : '';
                selected.push(`<div class="contact-initials" style="${getStyle}">${textContent}</div>`);
                selectedContactName.push(textLabel);
                selectedContactColor.push(colorHex);
            }
        });

        if (selected.length > 0) {
            selectedContacts.innerHTML = selected.join('');
        } else {
            selectedContacts.textContent = '';
        }
    }

    /**
     * Filters contact options based on the user's input in the search field.
     */
    function filterContacts() {
        const searchInput = document.querySelector('#contactSearch input');
        const filterValue = searchInput.value.toLowerCase();
        const contactOptions = document.getElementById('contactOptions');
        const contactOptionsDivs = contactOptions.querySelectorAll('.contact-option');

        contactOptionsDivs.forEach(optionDiv => {
            const contactName = optionDiv.querySelector('label').textContent.toLowerCase();
            if (contactName.includes(filterValue)) {
                optionDiv.style.display = 'flex';
            } else {
                optionDiv.style.display = 'none';
            }
        });
    }

    document.querySelector('#contactSearch input').addEventListener('input', filterContacts);

    /**
     * Chooses the priority level for a task and updates the UI accordingly.
     * @param {string} prio - The priority level ('high', 'medium', 'low').
     */
    function prioChooser(prio) {
        switch (prio) {
            case 'high':
            case 'medium':
            case 'low':
                setPrioBtn(`prio${prio.charAt(0).toUpperCase() + prio.slice(1)}`, prio);
                break;
        }
    }

    /**
     * Sets the priority button as checked and updates the current priority.
     * @param {string} id - The ID of the priority button.
     * @param {string} prio - The priority level.
     */
    function setPrioBtn(id, prio) {
        removeClassPrio();
        document.getElementById(id).classList.add('checked-' + prio);
        currentPrio = prio
    }

    /**
     * Removes all checked classes from priority buttons.
     */
    function removeClassPrio() {
        document.getElementById('prioHigh').classList.remove('checked-high');
        document.getElementById('prioMedium').classList.remove('checked-medium');
        document.getElementById('prioLow').classList.remove('checked-low');
    }

    /**
     * Removes all checked classes from priority buttons and set checked on medium.
     */
    function resetPrioBtn() {
        removeClassPrio();
        document.getElementById('prioMedium').classList.add('checked-medium');
        currentPrio = 'medium'
    }

    /**
     * Event listener setup for subtask UI elements.
     * Handles clicks on buttons for adding, closing, and saving subtasks.
     */
    function subtaskEventlister() {
        const addSubtaskQuery = addSubtask.querySelectorAll('img');
        addSubtaskQuery.forEach(subElement => {
            subElement.addEventListener('click', event => {
                if (event.target.id === 'addBtn') {
                    enhanceBtn.style.display = 'flex';
                    addBtn.style.display = 'none';
                    addSubtask.classList.toggle('field-activ');
                    subtask.focus();
                } else if (event.target.id === 'closeBtn') {
                    subtask.value = '';
                    enhanceBtn.style.display = 'none';
                    addBtn.style.display = 'block';
                    addSubtask.classList.toggle('field-activ');
                } else {
                    const subtaskInput = subtask.value.trim();
                    if (subtaskInput.length >= 1) {
                        createSubtask(subtask.value);
                    }
                }
            })
        })
        addSubtask.querySelector('input').addEventListener('click', () => {
            enhanceBtn.style.display = 'flex';
            addBtn.style.display = 'none';
            addSubtask.classList.toggle('field-activ');
        })
    }

    /**
     * Creates a new subtask if the input is valid and there are fewer than 5 subtasks.
     * @param {string} newSubtask - The title of the new subtask.
     */
    function createSubtask(newSubtask) {
        if (writtenSubtask.length < 20) {
            writtenSubtask.push({
                title: newSubtask,
                done: false
            });
            subtask.value = '';
            renderSubtask();
        } else {
            alert('Too many Subtask. Please only enter 20 Subtask');
        }
    }

    /**
     * Deletes a subtask based on its ID.
     * @param {number} id - The index of the subtask to delete.
     */
    function deleteSubtask(id) {
        writtenSubtask.splice(id, 1);
        renderSubtask();
    }

    /**
     * Opens the editing interface for a subtask by displaying the input field.
     * @param {number} id - The ID of the subtask to edit.
     */
    function editSubtask(id) {
        const editTask = document.getElementById('edit-' + id);
        const editTaskField = document.getElementById('editTaskField-' + id);
        editTask.style.display = 'flex';
        editTaskField.focus();
    }

    /**
     * Updates the subtask array with the new title after editing.
     * Rerenders the subtask list with updated titles.
     * @param {number} id - The ID of the subtask to update.
     */
    function editSubtaskArry(id) {
        const editSubtaskField = document.getElementById('editTaskField-' + id);
        const editSubtaskInput = editSubtaskField.value.trim()
        if (editSubtaskInput.length > 0) {
            const newSubtask = editSubtaskField.value;
            writtenSubtask[id].title = newSubtask
            renderSubtask();
        } else {
            return;
        }
    }


    /**
     * Renders the list of subtasks in the UI.
     */
    function renderSubtask() {
        const showSubtask = document.getElementById('showSubtask');
        showSubtask.innerHTML = '';
        for (let i = 0; i < writtenSubtask.length; i++) {
            const subtask = writtenSubtask[i];
            showSubtask.innerHTML += generateSubtaksHTML(dotMarker, subtask, i);
        }
    }

    /**
     * Clears the form inputs and resets the UI.
     * @param {Event} event - The form submit event.
     */
    function clearTask(event) {
        const contactOptions = document.getElementById('contactOptions');
        const contactOptionsDivs = contactOptions.querySelectorAll('.sc-check');
        event.preventDefault();
        taskTitle.value = '';
        taskDescription.value = '';
        selected = [];
        selectedContactName = [];
        selectedContacts.textContent = '';
        contactOptionsDivs.forEach(optionDiv => {
            checkOptionDiv(optionDiv);
        })
        taskDate.value = '';
        resetPrioBtn();
        taskSelector.innerHTML = 'Select task category <img class="task-selector-arrow" src="./assets/img/arrow-down.png" alt="Arrow">';
        subtask.value = '';
        writtenSubtask = [];
        renderSubtask();
    }

    /**
     * Creates a task object and posts it to the server if the form is valid.
     * @param {Event} event - The form submit event.
     */
    function createTask(event) {
        event.preventDefault();
        const isValid = validateForm();

        if (isValid) {
            const taskAsObject = getValues();
            postData("tasks", taskAsObject)
                .catch(error => {
                    console.error("Error posting data:", error);
                });
            clearTask(event);
            showToast('toast');
            if (window.location.pathname === '/add-task.html') {
                setTimeout(() => {
                    window.location.href = 'board.html';
                }, 1500)
            };
        } else {
            whichValueIsFalse();
        }
    }

    /**
     * Validates the task form fields to ensure all required fields are filled and the date is valid.
     * @returns {boolean} - Returns true if all fields are valid, otherwise false.
     */
    function validateForm() {
        const title = document.getElementById('taskTitle').value.trim();
        const date = document.getElementById('taskDate').value;
        const category = document.getElementById('taskSelector').innerText;

        const isTitleValid = title.length > 0;
        const isDateValid = checkDateValidity(date);
        const isCategorySelected = category !== 'Select task category';

        return isTitleValid && isDateValid && isCategorySelected;
    }

    /**
     * Checks if the selected date is either today or in the future.
     * @param {string} date - The selected date as a string.
     * @returns {boolean} - Returns true if the date is today or in the future, otherwise false.
     */
    function checkDateValidity(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return selectedDate >= today;
    }

    /**
     * Retrieves the values of the task form fields and returns an object representing the task.
     * @returns {Object} - An object containing task data including title, description, date, contacts, priority, category, subtasks, and progress status.
     */
    function getValues() {
        const title = taskTitle.value;
        const description = taskDescription.value;
        const date = taskDate.value;

        return {
            title: title,
            description: description,
            date: date,
            contacts: selectedContactName,
            contactColor: selectedContactColor,
            prio: currentPrio,
            category: category,
            subtask: writtenSubtask,
            progress: progressStatus
        };
    }

    /**
     * Highlights missing or incorrect fields in the form and displays error messages.
     */
    function whichValueIsFalse() {
        const title = document.getElementById('taskTitle');
        const date = document.getElementById('taskDate');
        const category = document.getElementById('taskSelector');
        const titleError = document.getElementById('title-error');
        const dateError = document.getElementById('date-error');
        const categoryError = document.getElementById('category-error');

        if (!title.value.trim()) {
            title.classList.add('required-border');
            titleError.textContent = "Please enter a title.";
        }

        if (!checkDateValidity(date.value)) {
            date.classList.add('required-border');
            dateError.textContent = "Please select a valid date (today or future).";
        }

        if (category.innerText === 'Select task category') {
            category.classList.add('required-border');
            categoryError.textContent = "Please select a task category.";
        }

        setTimeout(() => {
            titleError.textContent = "";
            dateError.textContent = "";
            categoryError.textContent = "";
            title.classList.remove('required-border');
            date.classList.remove('required-border');
            category.classList.remove('required-border');
        }, 1000);
    }

    /**
     * Handles click events on the page to close dropdowns when clicking outside of them.
     * Hides contact and task options if the click is outside of the respective elements.
     * @param {Event} event - The click event object.
     */
    document.addEventListener('click', (event) => {
        const contactOptions = document.getElementById('contactOptions');
        const taskOptions = document.getElementById('taskOptions');
        if (!contactSelector.contains(event.target) && !contactOptions.contains(event.target) && !contactSearch.contains(event.target)) {
            contactOptions.style.display = 'none';
            contactSearch.style.display = 'none';
            if (contactSelector.classList.contains('field-activ')) {
                contactSelector.classList.remove('field-activ');
                contactSelector.querySelector('img').classList.toggle('arrow-rotate');
            }
        }
        if (!taskSelector.contains(event.target)) {
            taskOptions.style.display = 'none';
            if (taskOptions.innerText === 'Select task category') {
                taskSelector.querySelector('img').classList.toggle('arrow-rotate');
            }
        }

        if (!addSubtask.contains(event.target)) {
            if (addSubtask.classList.contains('field-activ')) {
                addSubtask.classList.remove('field-activ');
                enhanceBtn.style.display = 'none';
            }
        }
    });

    window.initTask = initTask;
    window.prioChooser = prioChooser;
    window.editSubtask = editSubtask;
    window.editSubtaskArry = editSubtaskArry;
    window.deleteSubtask = deleteSubtask;
    window.createTask = createTask;
    window.clearTask = clearTask;

}());

