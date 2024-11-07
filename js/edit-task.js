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
    let currentPrio = 'medium';
    let category = '';
    let contacts = [];

    function initTask() {
        includeHTML();
        loadAllTasks();
        loadContacts();
    }

    async function loadContacts() {
        const loadedContacts = await getData("contacts");
        contacts = Object.values(loadedContacts)[0];
        renderTaskContact();
        attachEventListeners(); // Event-Listener erst nach dem Rendern der Kontakte hinzufügen
    }

    function renderTaskContact() {
        const editContactOptions = document.getElementById('editContactOptions');
        contacts.forEach(contact => {
            const contactsInitials = generateInitials(contact.name);
            editContactOptions.innerHTML += generateTaskContacts(contact.name, contactsInitials);
        });
    }

    // Erstellt Click-Events nach dem Rendern.
    function attachEventListeners() {
        contactEventLister();
        taskEventlister();
        subtaskEventlister();
    }

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

    function checkOptionDiv(optionDiv) {
        const checkIcon = optionDiv.querySelector('.check-icon');
        const isSelected = checkIcon.getAttribute('src') === './assets/img/check-btn.png';
        checkIcon.setAttribute('src', isSelected ? './assets/img/no-check-btn.png' : './assets/img/check-btn.png');
        optionDiv.classList.toggle('sc-check');
    }

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


    function updateSelectedContacts() {
        const editContactOptions = document.getElementById('editContactOptions');
        selected = [];
        selectedContactName = [];

        editContactOptions.querySelectorAll('.contact-option').forEach(optionDiv => {
            const checkIcon = optionDiv.querySelector('.check-icon');
            if (checkIcon.getAttribute('src') === './assets/img/check-btn.png') {
                const textLabel = optionDiv.querySelector('label').textContent;
                const textContent = optionDiv.querySelector('.contact-initials').textContent;
                const getStyle = optionDiv.querySelector('.contact-initials').getAttribute('style');
                selected.push(`<div class="contact-initials" style="${getStyle}">${textContent}</div>`);
                selectedContactName.push(textLabel)
            }
        });

        if (selected.length > 0) {
            editSelectedContacts.innerHTML = selected.join('');
        } else {
            editSelectedContacts.textContent = '';
        }
    }

    function filterContacts() {
        const searchInput = document.querySelector('#editContactSearch input'); // Greift auf das Suchfeld zu
        const filterValue = searchInput.value.toLowerCase(); // Holt den Wert des Suchfeldes und wandelt es in Kleinbuchstaben um
        const editContactOptions = document.getElementById('editContactOptions');
        const contactOptionsDivs = editContactOptions.querySelectorAll('.contact-option'); // Alle Kontaktoptionen

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
    document.querySelector('#editContactSearch input').addEventListener('input', filterContacts);


    // Funktionen für die Priorität Button`s
    function prioChooser(prio) {
        switch (prio) {
            case 'high':
                setPrioBtn('editPrioHigh', prio);
                break;
            case 'medium':
                setPrioBtn('editPrioMedium', prio);
                break;
            case 'low':
                setPrioBtn('editPrioLow', prio);
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
        document.getElementById('editPrioHigh').classList.remove('checked-high');
        document.getElementById('editPrioMedium').classList.remove('checked-medium');
        document.getElementById('editPrioLow').classList.remove('checked-low');
    }

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
                    if (editSubtaskInput.value.length >= 1) {
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

    function createSubtask(newSubtask) {
        if (writtenSubtask.length < 5) {
            writtenSubtask.push({ title: newSubtask, done: false });
            editSubtaskInput.value = '';
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
        const editShowSubtask = document.getElementById('editShowSubtask');
        editShowSubtask.innerHTML = '';
        for (let i = 0; i < writtenSubtask.length; i++) {
            const subtask = writtenSubtask[i];
            editShowSubtask.innerHTML += generateSubtaksHTML(dotMarker, subtask, i);
        }
    }

    function fillEditTask(taskData) {
        editTaskTitle.value = taskData.title;
        editTaskDescription.value = taskData.description;
        editTaskDate.value = taskData.date;
        prioChooser(taskData.prio);
        editTaskSelector.innerHTML = taskData.category;
        category = openTask.category
        if (taskData.subtask) {
            writtenSubtask = taskData.subtask;
            renderSubtask();
        }
        if (taskData.contacts) { readContactFromDB(taskData.contacts); }

    }

    function readContactFromDB(contacts) {
        // Kontakte auslesen und im Dropdown anzeigen
        const selectedContactsFromDB = contacts; // Array der Kontakte aus der DB
        const editContactOptions = document.getElementById('editContactOptions');

        // Setzt alle Kontakte zurück (ohne Auswahl)
        editContactOptions.querySelectorAll('.contact-option').forEach(optionDiv => {
            const checkIcon = optionDiv.querySelector('.check-icon');
            checkIcon.setAttribute('src', './assets/img/no-check-btn.png'); // Entfernt Häkchen
            optionDiv.classList.remove('sc-check'); // Entfernt Auswahlklasse
        });

        // Wähle die Kontakte aus, die in der Datenbank gespeichert sind
        editContactOptions.querySelectorAll('.contact-option').forEach(optionDiv => {
            const contactName = optionDiv.querySelector('label').textContent;

            if (selectedContactsFromDB.includes(contactName)) {
                const checkIcon = optionDiv.querySelector('.check-icon');
                checkIcon.setAttribute('src', './assets/img/check-btn.png'); // Setzt Häkchen
                optionDiv.classList.add('sc-check'); // Fügt Auswahlklasse hinzu
            }
        });
        // Kontakte anzeigen
        updateSelectedContacts();
    }

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

    function validateForm() {
        if (editTaskTitle.value && editTaskDate.value && editTaskSelector.innerText !== 'Select task category') {
            return true
        }
    }

    function getValues() {
        const title = editTaskTitle.value;
        const description = editTaskDescription.value;
        const date = editTaskDate.value;

        return { 'title': title, 'description': description, 'date': date, 'contacts': selectedContactName, 'prio': currentPrio, 'category': category, 'subtask': writtenSubtask, 'progress': openTask.progress }
    }

    function whichValueIsFalse() {
        if (!editTaskTitle.value) {
            editTaskTitle.classList.add('required-border');
        }
        if (!editTaskDate.value) {
            editTaskDate.classList.add('required-border');
        }
        if (editTaskSelector.innerText === 'Select task category') {
            editTaskSelector.classList.add('required-border');
        }
        setTimeout(() => {
            editTaskTitle.classList.remove('required-border');
            editTaskDate.classList.remove('required-border');
            editTaskSelector.classList.remove('required-border');
        }, 1000)

    }

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
