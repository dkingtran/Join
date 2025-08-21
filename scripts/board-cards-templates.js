function cardRender(task, assignedAvatarsHTML, progressPercent, maxSubtasks, total, progressColor) {
    return(
       `
       <div onclick="openBigTask('${displayTaskId}')">
        <h3 class="task-category ${getCategoryClass(task.category)}">
            ${task.category ? task.category : "Ohne Kategorie"}
        </h3>
        <h4 class="task-title">${task.title || "Ohne Titel"}</h4>
        <p class="task-description">${task.description || ""}</p>

        <div class="subtask-counter">
            <div class="subtask-progress">
                <div class="progress-bar"
                    style="width: ${progressPercent}%; background-color: ${progressColor};">
                </div>
            </div>
            <span class="counter">${total}/${maxSubtasks} Subtasks</span>
        </div>

        <div class="board-card-footer">
            <div class="assigned-user">
                ${assignedAvatarsHTML}
            </div>
            <div class="priority">
                ${getPriorityIcon(task.priority)}
            </div>
        </div>
        </div>
    `);
}

function priorityRender(cleanPriority){
    return`
        <img src="./assets/img/icons/priority-icons/${cleanPriority}.png" 
                alt="${cleanPriority} priority" 
                class="priority-icon" />
        `;
    
}


