// Beispiel Kontakte für Dummy -> später kommen Daten von Firebase
const contacts = [
    { name: 'Max Mustermann', initials: 'MM' },
    { name: 'Erika Musterfrau', initials: 'EM' },
    { name: 'John Doe', initials: 'JD' },
    { name: 'Jane Smith', initials: 'JS' },
];

let contact = [];

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
let writtenSubtask = [];
let selected = [];
let selectedContactName = [];
let currentPrio = 'medium';
let category = '';

function initTask() {
    includeHTML();
    renderTaskContact();
    attachEventListeners(); // Event-Listener erst nach dem Rendern der Kontakte hinzufügen
    contact = getData('contacts');
}

function renderTaskContact() {
    const editContactOptions = document.getElementById('editContactOptions');
    contacts.forEach(contact => {
        const contactsInitials = generateInitials(contact.name);
        editContactOptions.innerHTML += `
        <div class="contact-option">
            <div class="contact-initials" style="background-color: ${getRandomColor()}">${contactsInitials}</div>
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
            console.log(event.target.innerText);
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
    writtenSubtask.push({title: newSubtask, done: false});
    editSubtaskInput.value = '';
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
    writtenSubtask[id].title = newSubtask
    renderSubtask();
}

function renderSubtask() {
    const editShowSubtask = document.getElementById('editShowSubtask');
    editShowSubtask.innerHTML = '';
    for (let i = 0; i < writtenSubtask.length; i++) {
        const subtask = writtenSubtask[i];
        editShowSubtask.innerHTML += `
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
            </div>`;
    }
}

function clearTask(event) {
    const editContactOptions = document.getElementById('editContactOptions');
    const contactOptionsDivs = editContactOptions.querySelectorAll('.sc-check');
    event.preventDefault();
    editTaskTitle.value = '';
    editTaskDescription.value = '';
    selected = [];
    selectedContactName = [];
    editSelectedContacts.textContent = '';
    contactOptionsDivs.forEach(optionDiv => {
        checkOptionDiv(optionDiv);
    })
    editTaskDate.value = '';
    resetPrioBtn();
    editTaskSelector.innerHTML = 'Select task category <img class="task-selector-arrow" src="./assets/img/arrow-down.png" alt="Arrow">';
    editSubtaskInput.value = '';
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
    if (editTaskTitle.value && editTaskDate.value && editTaskSelector.innerText !== 'Select task category') {
        return true
    }
}

function getValues() {
    const title = editTaskTitle.value;
    const description = editTaskDescription.value;
    const date = editTaskDate.value;

    return { 'title': title, 'description': description, 'date': date, 'contacts': selectedContactName, 'prio': currentPrio, 'category': category, 'subtask': writtenSubtask,  'progress': 'to-do' }
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

function showToast() {
    const editToast = document.getElementById('editToast');
    
    // Zeige die Toast-Nachricht an
    editToast.classList.add('toast-visible');

    // Nach 3 Sekunden die Toast-Nachricht verschwinden lassen
    setTimeout(() => {
        editToast.classList.remove('toast-visible');
    }, 3000);
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