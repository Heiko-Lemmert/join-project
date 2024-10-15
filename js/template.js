function genetareHTML() {
    return `    <div class="background-bigListView">
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
                                <img class="overlay-action-btn btn-delete" src="./assets/img/board-delete.png" alt="" onclick="deleteTask('${openTask.databaseKey}')"></img>
                                <hr>
                                <img class="overlay-action-btn btn-edit" src="./assets/img/board-edit.png" alt="" onclick="openOrCloseEditTask()"></img>
                            </div>
                        </div>
                    </div>
               </div>
            </div>    `
}