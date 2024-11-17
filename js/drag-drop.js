/**
 * Checks for empty lists in the board and displays a message if a list is empty.
 */
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

/**
 * Sets up drag-and-drop functionality for tasks.
 */
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
                checkForEmptyLists();
                // dagAndDrop();//the problem solved
                checkForList();
            }
        });
    }
    setupDropArea(rightBox);
    setupDropArea(rightBoxNum2);
    setupDropArea(leftBox);
    setupDropArea(leftBoxNum2);
}

/**
 * Toggles the scroll behavior in the list area based on screen size.
 */
function checkForList() {
    let scrollDivs = document.querySelectorAll(".scroll-div");
    for (let i = 0; i < scrollDivs.length; i++) {
        let scrollDiv = scrollDivs[i];
        let lists = scrollDiv.querySelectorAll(".list");
        scrollDiv.style.overflowX = "hidden";
        scrollDiv.style.overflowY = "hidden";
        if (window.innerWidth <= 970) {
            if (lists.length <= 1) {
                scrollDiv.style.overflowX = "hidden";
            } else {
                scrollDiv.style.overflowX = "scroll";
            }
        } else if ((window.innerWidth > 970)) {
            if (lists.length <= 1) {
                scrollDiv.style.overflowY = "hidden";
            } else  {
                scrollDiv.style.overflowY = "hidden";
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', checkForList);
window.addEventListener('resize', checkForList);

/**
 * Determines the new progress state based on the drop area.
 * @param {string} column - Column ID where the task was dropped.
 * @returns {string} The updated progress state.
 */
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

/**
 * Highlights a draggable area when a task is dragged over it.
 * @param {string} id - The ID of the draggable area.
 */
function highlight(id) {
    const element = document.getElementById(id);
    element.classList.add('drag-area-highlight');
}

/**
 * Removes highlight from a draggable area.
 * @param {string} id - The ID of the draggable area.
 */
function removeHighlight(id) {
    const element = document.getElementById(id);
    element.classList.remove('drag-area-highlight');
}