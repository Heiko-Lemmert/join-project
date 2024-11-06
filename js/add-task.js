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
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const date = today.getDate()
    const dateStr = `${year}-${month}-${date}`
    const input = document.querySelector('[name=task-date]')
    input.setAttribute('min', dateStr)
    let writtenSubtask = [];
    let selected = [];
    let selectedContactName = [];
    let selectedContactColor = [];
    let currentPrio = 'medium';
    let category = '';
    let contacts = [];

    function initTask() {
        includeHTML();
        loadContacts();
    }

    async function loadContacts() {
        const loadedContacts = await getData("contacts");
        contacts = Object.values(loadedContacts)[0];
        renderTaskContact();
        attachEventListeners(); // Event-Listener erst nach dem Rendern der Kontakte hinzufügen
    }

    function renderTaskContact() {
        const contactOptions = document.getElementById('contactOptions');
        contacts.forEach(contact => {
            const contactsInitials = generateInitials(contact.name);
            contactOptions.innerHTML += generateTaskContacts(contact.name, contactsInitials, contact.color);
        });
    }

    // Erstellt Click-Events nach dem Rendern.
    function attachEventListeners() {
        contactEventLister();
        taskEventlister();
        subtaskEventlister();
    }

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

    function checkOptionDiv(optionDiv) {
        const checkIcon = optionDiv.querySelector('.check-icon');
        const isSelected = checkIcon.getAttribute('src') === './assets/img/check-btn.png';
        checkIcon.setAttribute('src', isSelected ? './assets/img/no-check-btn.png' : './assets/img/check-btn.png');
        optionDiv.classList.toggle('sc-check');
    }

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

    function filterContacts() {
        const searchInput = document.querySelector('#contactSearch input'); // Greift auf das Suchfeld zu
        const filterValue = searchInput.value.toLowerCase(); // Holt den Wert des Suchfeldes und wandelt es in Kleinbuchstaben um
        const contactOptions = document.getElementById('contactOptions');
        const contactOptionsDivs = contactOptions.querySelectorAll('.contact-option'); // Alle Kontaktoptionen

        // Schleife durch alle Kontaktoptionen und überprüft, ob der Name mit dem Filter übereinstimmt
        contactOptionsDivs.forEach(optionDiv => {
            const contactName = optionDiv.querySelector('label').textContent.toLowerCase(); // Name des Kontakts in Kleinbuchstaben
            if (contactName.includes(filterValue)) {
                optionDiv.style.display = 'flex'; // Zeigt den Kontakt an, wenn der Name mit dem Filter übereinstimmt
            } else {
                optionDiv.style.display = 'none'; // Versteckt den Kontakt, wenn er nicht übereinstimmt
            }
        });
    }

    // Event Listener, um die Funktion bei Eingabe im Suchfeld auszuführen
    document.querySelector('#contactSearch input').addEventListener('input', filterContacts);


    // Funktionen für die Priorität Button`s
    function prioChooser(prio) {
        switch (prio) {
            case 'high':
                setPrioBtn('prioHigh', prio);
                break;
            case 'medium':
                setPrioBtn('prioMedium', prio);
                break;
            case 'low':
                setPrioBtn('prioLow', prio);
                break;
            default:
                break;
        }
    }

    function setPrioBtn(id, prio) {
        removeClassPrio();
        document.getElementById(id).classList.add('checked-' + prio);
        currentPrio = prio
    }

    function resetPrioBtn() {
        removeClassPrio();
        document.getElementById('prioMedium').classList.add('checked-medium');
        currentPrio = 'medium'
    }

    function removeClassPrio() {
        document.getElementById('prioHigh').classList.remove('checked-high');
        document.getElementById('prioMedium').classList.remove('checked-medium');
        document.getElementById('prioLow').classList.remove('checked-low');
    }

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
                    if (subtask.value.length >= 1) {
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

    function createSubtask(newSubtask) {
        if (writtenSubtask.length < 5) {
            writtenSubtask.push({ title: newSubtask, done: false });
            subtask.value = '';
            renderSubtask();
        } else {
            alert('Too many Subtask. Please only enter 5 Subtask');
        }
    }

    function deleteSubtask(id) {
        writtenSubtask.splice(id, 1);
        renderSubtask();
    }

    function editSubtask(id) {
        const editTask = document.getElementById('edit-' + id);
        const editTaskField = document.getElementById('editTaskField-' + id);
        editTask.style.display = 'flex';
        editTaskField.focus();
    }

    function editSubtaskArry(id) {
        const editSubtaskField = document.getElementById('editTaskField-' + id);
        const newSubtask = editSubtaskField.value;
        writtenSubtask[id].title = newSubtask
        renderSubtask();
    }

    function renderSubtask() {
        const showSubtask = document.getElementById('showSubtask');
        showSubtask.innerHTML = '';
        for (let i = 0; i < writtenSubtask.length; i++) {
            const subtask = writtenSubtask[i];
            showSubtask.innerHTML += generateSubtaksHTML(dotMarker, subtask, i);
        }
    }

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
        } else {
            whichValueIsFalse();
        }
    }

    function validateForm() {
        if (taskTitle.value && taskDate.value && taskSelector.innerText !== 'Select task category') {
            return true
        }
    }

    function getValues() {
        const title = taskTitle.value;
        const description = taskDescription.value;
        const date = taskDate.value;

        return { 'title': title, 'description': description, 'date': date, 'contacts': selectedContactName, 'contactColor': selectedContactColor, 'prio': currentPrio, 'category': category, 'subtask': writtenSubtask, 'progress': progressStatus }
    }

    function whichValueIsFalse() {
        if (!taskTitle.value) {
            taskTitle.classList.add('required-border');
        }
        if (!taskDate.value) {
            taskDate.classList.add('required-border');
        }
        if (taskSelector.innerText === 'Select task category') {
            taskSelector.classList.add('required-border');
        }
        setTimeout(() => {
            taskTitle.classList.remove('required-border');
            taskDate.classList.remove('required-border');
            taskSelector.classList.remove('required-border');
        }, 1000)
    }

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