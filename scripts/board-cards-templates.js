/**
 * Renders a mini board card and wires the click to open the big card.
 * @param {string} displayTaskId - ID used by openBigTask to load full details.
 * @param {Object} task - Task data object.
 * @param {string} assignedAvatarsHTML - Prebuilt avatars HTML.
 * @param {number} progressPercent - Subtask progress in percent.
 * @param {number} maxSubtasks - Max subtasks shown in counter.
 * @param {number} total - Actual subtasks counted.
 * @param {string} progressColor - CSS color for progress bar.
 * @returns {string} Card HTML.
 */
function cardRender(
	tasksId,
	displayedTasksId,
	task,
	assignedAvatarsHTML,
	progress
) {
	return /* HTML */ `
		<div
			class="board-card"
			data-displayed-tasks-id="${displayedTasksId}"
			data-tasks-id="${tasksId}">
			<div onclick="openBigCard('${displayedTasksId}')">
				<h3 class="task-category ${getCategoryClass(task.category)}">
					${task.category ? task.category : "No category"}
				</h3>
				<h4 class="task-title">${task.title || "No titel"}</h4>
				<p class="task-description">${task.description || ""}</p>

				<div class="subtask-counter">
					<div class="subtask-progress">
						<div
							class="progress-bar"
							style="width:${progress.progressPercent}%"></div>
					</div>
					<span class="counter">${progress.total}/${progress.maxSubtasks} Subtasks</span>
				</div>

				<div class="board-card-footer">
					<div class="assigned-user">${assignedAvatarsHTML}</div>
					<div class="priority">${getPriorityIcon(task.priority)}</div>
				</div>
			</div>
		</div>
	`;
}


function priorityRender(cleanPriority) {
  return `
        <img src="./assets/img/icons/priority-icons/${cleanPriority}.png" 
                alt="${cleanPriority} priority" 
                class="priority-icon" />
        `;

}


