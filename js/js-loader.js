/**
 * Dynamically loads an external JavaScript file and runs a callback on load.
 * @param {string} src - Source URL of the script.
 * @param {function} callback - Function to call once the script loads.
 */
function loadExternalScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.id = 'taskOnBoard';
    script.onload = callback;
    document.head.appendChild(script);
}

/**
 * Initializes the 'Edit Task' overlay UI and sets up event listeners.
 */
function loadInitEditTask() {
    const editBtn = document.getElementById('editBtn');
    initTask();
    editBtn.addEventListener('click', () => {
        setTimeout(openOrCloseEditTask, 1000);
        setTimeout(closeViewList, 1000);
    });
    fillEditTask(openTask.databaseKey);
}

/**
 * Initializes the 'Add Task' overlay UI and sets up event listeners.
 */
function loadInitAddTask() {
    const cancelBtn = document.getElementById('cancelBtn');
    const createBtn = document.getElementById('createBtn');
    initTask();
    cancelBtn.addEventListener('click', () => {
        showOrHideOverlay();
    });
    createBtn.addEventListener('click', () => {
        setTimeout(showOrHideOverlay, 1000);
        setTimeout(loadAllTasks, 1000);
    });
}