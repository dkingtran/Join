/**
 * Renders a mini board card and wires the click to open the big card.
 * 
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
					<span class="counter"
						>${progress.total}/${progress.maxSubtasks} Subtasks</span
					>
				</div>

				<div class="board-card-footer">
					<div class="assigned-user">${assignedAvatarsHTML}</div>
					<div class="priority">${getPriorityIcon(task.priority)}</div>
				</div>
			</div>
			<img
				class="swap-icon"
				src="./assets/img/icons/board/swap-status.svg"
				alt="swap task icon" />
		</div>
	`;
}

/**
 * Renders an HTML string for a priority icon based on the given priority level.
 *
 * @param {string} cleanPriority - The priority level (e.g., 'high', 'medium', 'low') used to select the corresponding icon.
 * @returns {string} An HTML string containing an <img> element for the specified priority icon.
 */
function priorityRender(cleanPriority) {
	return /* HTML */ `
        <img src="./assets/img/icons/priority-icons/${cleanPriority}.png" 
                alt="${cleanPriority} priority" 
                class="priority-icon" />
        `;

}

/**
 * Generates an HTML template string for a switch dropdown menu with provided buttons.
 *
 * @param {string} buttonsHTML - The HTML string representing the buttons to be included in the dropdown.
 * @returns {string} The complete HTML string for the switch dropdown menu.
 */
function getSwitchDropdownTemplate(buttonsHTML) {
	return /* HTML */ ` <div class="switch-dropdown">
		<p>Move To</p>
		${buttonsHTML}
	</div>`;
}

/**
 * Generates an HTML template string for a dropdown button with a upward arrow icon.
 *
 * @param {number} columnIndex - The index of the column for which the button is generated.
 * @returns {string} The HTML string for the arrow up button, including an image and the column's short status.
 */
function getArrowUpBtnTemplate(columnIndex) {
	return /* HTML */ `<button
		class="switch-dropdown-btn"
		onclick="switchColumn(event, ${columnIndex})">
		<img src="./assets/img/icons/board/arrow-upward.svg" alt="arrow upward" />
		${shortStatus[columnIndex]}
	</button>`;
}

/**
 * Generates an HTML template string for a dropdown button with a downward arrow icon.
 *
 * @param {number} columnIndex - The index of the column for which the button is generated.
 * @returns {string} The HTML string for the arrow down button.
 */
function getArrowDownBtnTemplate(columnIndex) {
	return /* HTML */ `<button
		class="switch-dropdown-btn"
		onclick="switchColumn(event, ${columnIndex})">
		<img
			src="./assets/img/icons/board/arrow-downward.svg"
			alt="arrow downward" />
		${shortStatus[columnIndex]}
	</button>`;
}

/**
 * Generates an HTML string for displaying an empty-message for a Kanban column.
 *
 * @param {string} headerText - The text to display after "No tasks" in the message.
 * @returns {string} The HTML string for the empty message.
 */
function getKanbanEmptyMessage(headerText) {
	return /* HTML */ ` <div class="empty-msg">No tasks ${headerText}</div>`;
}

/**
 * Returns the HTML template string for a task placeholder element.
 *
 * @returns {string} The HTML string representing a placeholder div.
 */
function getTaskPlaceholderTemplate() {
	return /* HMTL */ `<div class="placeholder"></div>`;
}