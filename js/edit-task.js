(function () {
    const editTaskTitle = document.getElementById('editTaskTitle');
    const editTaskDescription = document.getElementById('editTaskDescription');
    const editTaskDate = document.getElementById('editTaskDate');
    const editContactSelector = document.getElementById('editContactSelector');
    const editTaskSelector = document.getElementById('editTaskSelector');
    const editSelectedContacts = document.getElementById('editSelectedContacts');
    const editContactSearch = document.getElementById('editContactSearch');
    const editEnhanceBtn = document.getElementById('editEnhanceBtn');
    const editAddSubtask = document.getElementById('editAddSubtask');
    const editSubtaskInput = document.getElementById('editSubtaskInput');
    const editAddBtn = document.getElementById('editAddBtn');
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
    let openTaskProgress = '';

    /**
     * Initializes the task module by including HTML and loading contacts.
     */
    function initTask() {
        includeHTML();
        loadAllTasks();
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
        const editContactOptions = document.getElementById('editContactOptions');
        contacts.forEach(contact => {
            const contactsInitials = generateInitials(contact.name);
            editContactOptions.innerHTML += generateTaskContacts(contact.name, contactsInitials, contact.color);
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
        const editContactOptions = document.getElementById('editContactOptions');
        const contactOptionsDivs = editContactOptions.querySelectorAll('.contact-option');

        contactOptionsDivs.forEach(optionDiv => {
            optionDiv.addEventListener('click', () => {
                checkOptionDiv(optionDiv);
                updateSelectedContacts(); // Update selected contacts
            });
        });

        editContactSelector.addEventListener('click', () => {
            editContactSelector.classList.toggle('field-activ');
            editContactSelector.querySelector('img').classList.toggle('arrow-rotate');
            editContactOptions.style.display = editContactOptions.style.display === 'block' ? 'none' : 'block';
            editContactSearch.style.display = editContactSearch.style.display === 'block' ? 'none' : 'block';
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
        const editTaskOptions = document.getElementById('editTaskOptions');
        const taskOptionsDivs = editTaskOptions.querySelectorAll('.task-option');

        editTaskSelector.addEventListener('click', () => {
            editTaskOptions.style.display = editTaskOptions.style.display === 'block' ? 'none' : 'block';
            if (editTaskSelector.innerText === 'Select task category') {
                editTaskSelector.querySelector('img').classList.toggle('arrow-rotate');
            }
        })

        taskOptionsDivs.forEach(taskDiv => {
            taskDiv.addEventListener('click', event => {
                editTaskSelector.textContent = '';
                editTaskSelector.textContent = event.target.innerText;
                category = event.target.innerText;
            })
        })
    }


    /**
     * Updates the list of selected contacts based on user selection.
     */
    function updateSelectedContacts() {
        const editContactOptions = document.getElementById('editContactOptions');
        selected = [];
        selectedContactName = [];
        selectedContactColor = [];

        editContactOptions.querySelectorAll('.contact-option').forEach(optionDiv => {
            const checkIcon = optionDiv.querySelector('.check-icon');
            if (checkIcon.getAttribute('src') === './assets/img/check-btn.png') {
                const textLabel = optionDiv.querySelector('label').textContent;
                const textContent = optionDiv.querySelector('.contact-initials').textContent;
                const getStyle = optionDiv.querySelector('.contact-initials').getAttribute('style');
                const colorMatch = getStyle.match(/background-color:\s*(#[0-9A-Fa-f]{6})/);
                const colorHex = colorMatch ? colorMatch[1] : '';
                selected.push(`<div class="contact-initials" style="${getStyle}">${textContent}</div>`);
                selectedContactName.push(textLabel)
                selectedContactColor.push(colorHex);
            }
        });

        if (selected.length > 0) {
            editSelectedContacts.innerHTML = selected.join('');
        } else {
            editSelectedContacts.textContent = '';
        }
    }

    /**
     * Filters contact options based on the user's input in the search field.
     */
    function filterContacts() {
        const searchInput = document.querySelector('#editContactSearch input');
        const filterValue = searchInput.value.toLowerCase();
        const editContactOptions = document.getElementById('editContactOptions');
        const contactOptionsDivs = editContactOptions.querySelectorAll('.contact-option');

        contactOptionsDivs.forEach(optionDiv => {
            const contactName = optionDiv.querySelector('label').textContent.toLowerCase();
            if (contactName.includes(filterValue)) {
                optionDiv.style.display = 'flex';
            } else {
                optionDiv.style.display = 'none';
            }
        });
    }

    document.querySelector('#editContactSearch input').addEventListener('input', filterContacts);


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
        document.getElementById('editPrioHigh').classList.remove('checked-high');
        document.getElementById('editPrioMedium').classList.remove('checked-medium');
        document.getElementById('editPrioLow').classList.remove('checked-low');
    }

    /**
     * Event listener setup for subtask UI elements.
     * Handles clicks on buttons for adding, closing, and saving subtasks.
     */
    function subtaskEventlister() {
        const addSubtaskQuery = editAddSubtask.querySelectorAll('img');
        addSubtaskQuery.forEach(subElement => {
            subElement.addEventListener('click', event => {
                if (event.target.id === 'editAddBtn') {
                    editEnhanceBtn.style.display = 'flex';
                    editAddBtn.style.display = 'none';
                    editAddSubtask.classList.toggle('field-activ');
                    editSubtaskInput.focus();
                } else if (event.target.id === 'editCloseBtn') {
                    editSubtaskInput.value = '';
                    editEnhanceBtn.style.display = 'none';
                    editAddBtn.style.display = 'block';
                    editAddSubtask.classList.toggle('field-activ');
                } else {
                    const subtaskInput = subtask.value.trim();
                    if (subtaskInput.length >= 1) {
                        createSubtask(editSubtaskInput.value);
                    }
                }
            })
        })
        editAddSubtask.querySelector('input').addEventListener('click', () => {
            editEnhanceBtn.style.display = 'flex';
            editAddBtn.style.display = 'none';
            editAddSubtask.classList.toggle('field-activ');
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
            editSubtaskInput.value = '';
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
        const editShowSubtask = document.getElementById('editShowSubtask');
        editShowSubtask.innerHTML = '';
        for (let i = 0; i < writtenSubtask.length; i++) {
            const subtask = writtenSubtask[i];
            editShowSubtask.innerHTML += generateSubtaksHTML(dotMarker, subtask, i);
        }
    }

    /**
     * Populates the edit task form with data retrieved from the database using the task key.
     * @param {string} key - The database key of the task to edit.
     */
    async function fillEditTask(key) {
        const taskDataFromDB = await getData("tasks/" + key);
        openTaskProgress = taskDataFromDB.progress;
        editTaskTitle.value = taskDataFromDB.title;
        editTaskDescription.value = taskDataFromDB.description;
        editTaskDate.value = taskDataFromDB.date;
        prioChooser(taskDataFromDB.prio);
        editTaskSelector.innerHTML = taskDataFromDB.category;
        category = openTask.category
        if (taskDataFromDB.subtask) {
            writtenSubtask = taskDataFromDB.subtask;
            renderSubtask();
        }
        if (taskDataFromDB.contacts) {
            readContactFromDB(taskDataFromDB.contacts);
        }

    }

    /**
     * Updates the selected contacts in the edit form based on the contact data from the database.
     * @param {string[]} contacts - Array of contact names from the database.
     */
    function readContactFromDB(contacts) {
        const selectedContactsFromDB = contacts;
        const editContactOptions = document.getElementById('editContactOptions');

        editContactOptions.querySelectorAll('.contact-option').forEach(optionDiv => {
            const checkIcon = optionDiv.querySelector('.check-icon');
            checkIcon.setAttribute('src', './assets/img/no-check-btn.png');
            optionDiv.classList.remove('sc-check');
        });

        editContactOptions.querySelectorAll('.contact-option').forEach(optionDiv => {
            const contactName = optionDiv.querySelector('label').textContent;

            if (selectedContactsFromDB.includes(contactName)) {
                const checkIcon = optionDiv.querySelector('.check-icon');
                checkIcon.setAttribute('src', './assets/img/check-btn.png');
                optionDiv.classList.add('sc-check');
            }
        });
        updateSelectedContacts();
    }

    /**
     * Submits the edited task data to the database and displays a success message if valid.
     * @param {Event} event - The submit event object.
     */
    function editTask(event) {
        event.preventDefault();
        const isValid = validateForm();
        const databaseKey = openTask.databaseKey;

        if (isValid) {
            const taskAsObject = getValues();
            updateData("tasks/" + databaseKey, taskAsObject)
                .catch(error => {
                    console.error("Error updating data:", error);
                });
            showToast('editToast');
        } else {
            whichValueIsFalse();
        }
    }

    /**
     * Validates the task form fields to ensure all required fields are filled.
     * @returns {boolean} - Returns true if all fields are valid, otherwise false.
     */

    function validateForm() {
        const title = document.getElementById('editTaskTitle').value.trim();
        const date = document.getElementById('editTaskDate').value;
        const category = document.getElementById('editTaskSelector').innerText;

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
        const title = editTaskTitle.value;
        const description = editTaskDescription.value;
        const date = editTaskDate.value;

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
        const title = document.getElementById('editTaskTitle');
        const date = document.getElementById('editTaskDate');
        const category = document.getElementById('editTaskSelector');
        const titleError = document.getElementById('editTitle-error');
        const dateError = document.getElementById('editDate-error');
        const categoryError = document.getElementById('editCategory-error');

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
        const editContactOptions = document.getElementById('editContactOptions');
        const editTaskOptions = document.getElementById('editTaskOptions');
        if (!editContactSelector.contains(event.target) && !editContactOptions.contains(event.target) && !editContactSearch.contains(event.target)) {
            editContactOptions.style.display = 'none';
            editContactSearch.style.display = 'none';
            if (editContactSelector.classList.contains('field-activ')) {
                editContactSelector.classList.remove('field-activ');
                editContactSelector.querySelector('img').classList.toggle('arrow-rotate');
            }
        }
        if (!editTaskSelector.contains(event.target)) {
            editTaskOptions.style.display = 'none';
            if (editTaskOptions.innerText === 'Select task category') {
                editTaskSelector.querySelector('img').classList.toggle('arrow-rotate');
            }
        }

        if (!editAddSubtask.contains(event.target)) {
            if (editAddSubtask.classList.contains('field-activ')) {
                editAddSubtask.classList.remove('field-activ');
                editEnhanceBtn.style.display = 'none';
            }
        }
    });

    window.initTask = initTask;
    window.prioChooser = prioChooser;
    window.editSubtask = editSubtask;
    window.deleteSubtask = deleteSubtask;
    window.editSubtaskArry = editSubtaskArry;
    window.fillEditTask = fillEditTask;
    window.editTask = editTask;
}());