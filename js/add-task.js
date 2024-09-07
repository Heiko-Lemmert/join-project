// Beispiel Kontakte für Dummy -> später kommen Daten von Firebase
const contacts = [
    { name: 'Max Mustermann', initials: 'MM' },
    { name: 'Erika Musterfrau', initials: 'EM' },
    { name: 'John Doe', initials: 'JD' },
    { name: 'Jane Smith', initials: 'JS' },
];

let contact = [];

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
const contactBackgroundColor = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#0038FF', '#FFE62B', '#FF4646', '#FFBB2B'];
const dotMarker = '&bull;';
let writtenSubtask = [];
let selected = [];
let selectedContactName = [];
let currentPrio = 'medium';
let category = '';

function init() {
    includeHTML();
    renderTaskContact();
    attachEventListeners(); // Event-Listener erst nach dem Rendern der Kontakte hinzufügen
    contact = getData('contacts');
}

// Funktion zur Generierung einer zufälligen Farbe
function getRandomColor() {
    return contactBackgroundColor[Math.floor(Math.random() * contactBackgroundColor.length)];
}

function renderTaskContact() {
    const contactOptions = document.getElementById('contactOptions');
    contacts.forEach(contact => {
        contactOptions.innerHTML += `
        <div class="contact-option">
            <div class="contact-initials" style="background-color: ${getRandomColor()}">${contact.initials}</div>
            <label>${contact.name}</label>
            <img src="./assets/img/no-check-btn.png" alt="Check" class="check-icon" id="checkIcon">
        </div>`;
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
            console.log(event.target.innerText);
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

    contactOptions.querySelectorAll('.contact-option').forEach(optionDiv => {
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
        selectedContacts.innerHTML = selected.join('');
    } else {
        selectedContacts.textContent = '';
    }
}

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
    writtenSubtask.push(newSubtask);
    subtask.value = '';
    renderSubtask();
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
    writtenSubtask.splice(id, 1, newSubtask);
    renderSubtask();
}

function renderSubtask() {
    const showSubtask = document.getElementById('showSubtask');
    showSubtask.innerHTML = '';
    for (let i = 0; i < writtenSubtask.length; i++) {
        const subtask = writtenSubtask[i];
        showSubtask.innerHTML += `
            <div class="new-subtask">
                <p>${dotMarker} ${subtask}</p>
                <div class="new-subtask-btn">
                    <img src="./assets/img/edit-subtask.png" onclick="editSubtask(${i})" alt="Edit">
                    <img src="./assets/img/delete-subtask.png" onclick="deleteSubtask(${i})" alt="Delete">
                </div>
                <div class="edit-field" id="edit-${i}">
                    <input name="" value="${subtask}" id="editTaskField-${i}">
                    <div class="edit-field-btn">
                        <img src="./assets/img/delete-subtask.png" onclick="deleteSubtask(${i})" alt="Delete">
                        <hr>
                        <img src="./assets/img/check-addtask.png" alt="Enter" onclick="editSubtaskArry(${i})">
                    </div>
                </div>
            </div>`;
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
    writtenSubtask = [];
    renderSubtask();
}

function createTask(event) {
    event.preventDefault();
    const isValid = validateForm();

    if (isValid) {
        console.log('Formular ist gültig.');
        const taskAsObject = getValues();
        postData("tasks", taskAsObject)
            .catch(error => {
                console.error("Error posting data:", error);
            });
        clearTask(event);
        showToast();
    } else {
        console.log('Formular ist ungültig.');
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

    return { 'title': title, 'description': description, 'date': date, 'contacts' : selectedContactName, 'prio': currentPrio, 'category': category, 'subtask': writtenSubtask }
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

function showToast() {
    const toast = document.getElementById('toast');
    
    // Zeige die Toast-Nachricht an
    toast.classList.add('toast-visible');

    // Nach 3 Sekunden die Toast-Nachricht verschwinden lassen
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 3000);
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