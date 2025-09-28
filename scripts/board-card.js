/**
 * Maps task statuses to their corresponding DOM column element IDs.
 * @type {Object.<string, string>}
 */
const statusToColumnId = {
    "to-do": "tasks-list-open",
    "in-progress": "tasks-list-inprogress",
    "feedback": "tasks-list-awaitfeedback",
    "done": "tasks-list-done"
};

/**
 * Determines the column ID for a task based on its status object.
 * @param {Object} statusObj - The task status object (e.g., { "in-progress": true }).
 * @returns {string|null} The matching column ID or null if not found.
 */
function getColumnIdByStatus(statusObj) {
    if (!statusObj || typeof statusObj !== "object") return null;
    for (const status in statusObj) {
        if (statusObj[status] === true && statusToColumnId[status]) {
            return statusToColumnId[status];
        }
    }
    return null;
}

/**
 * Retrieves contact information (color and initials) for a given full name.
 * @param {string} fullName - The full name of the contact.
 * @returns {Object|null} An object containing color and initials or null if not found.
 */
function getContactByName(fullName) {
    return contactsMap[fullName] || null;
}

/**
 * Renders avatars for assigned users (up to 3).
 * Additional users are grouped into an overflow avatar (e.g., "+2").
 * @param {string[]} [users=[]] - List of user full names.
 * @returns {string} HTML string of rendered avatars.
 */
function renderAssignedAvatars(users = []) {
    const maxVisible = 3;
    const visible = users.slice(0, maxVisible);
    const hidden = users.slice(maxVisible);
    const avatars = visible.map(renderSingleAvatar);
    if (hidden.length > 0) {
        avatars.push(renderOverflowAvatar(hidden));
    }
    return avatars.join("");
}

/**
 * Renders a single avatar with initials and background color.
 * @param {string} name - Full name of the user.
 * @returns {string} HTML string of the avatar element.
 */
function renderSingleAvatar(name) {
    const contact = getContactByName(name);
    const initials = getInitials(name);
    const color = contact?.color || "fallback-gray";
    return `<div class="avatar ${color}" title="${name}">${initials}</div>`;
}

/**
 * Renders an overflow avatar showing "+X" for hidden users.
 * Displays a tooltip with all hidden user names.
 * @param {string[]} users - List of hidden user full names.
 * @returns {string} HTML string of the overflow avatar.
 */
function renderOverflowAvatar(users) {
    const tooltip = users.join(", ");
    return `
        <div class="avatar overflow-avatar">
            +${users.length}
            <div class="custom-tooltip">${tooltip}</div>
        </div>
    `;
}

/**
 * Calculates progress for subtasks.
 * @param {Object} [subtasks={}] - Subtask objects keyed by name or ID.
 * @returns {{progressPercent: number, total: number, maxSubtasks: number}} Progress data.
 */
function getSubtaskProgress(subtasks = {}) {
    if (typeof subtasks !== "object" || Array.isArray(subtasks)) {
        return { progressPercent: 0, total: 0, maxSubtasks: 0 };
    }
    const keys = Object.keys(subtasks);
    const totalSubtasks = keys.length;
    const doneCount = keys.filter(key => subtasks[key].done === true).length;
    const progressPercent = totalSubtasks > 0 ? (doneCount / totalSubtasks) * 100 : 0;
    return {
        progressPercent,
        total: doneCount,
        maxSubtasks: totalSubtasks
    };
}

/**
 * Returns a CSS class based on the task category.
 * @param {string} category - The category name.
 * @returns {string} The corresponding CSS class.
 */
function getCategoryClass(category) {
    if (!category) return "category-default";
    if (category.toLowerCase() === "technical task") {
        return "category-technical";
    }
    if (category.toLowerCase() === "user story") {
        return "category-userstory";
    }
    return "category-default";
}

/**
 * Returns the HTML icon for the given priority level.
 * @param {string} priority - Priority level ("low", "medium", "urgent").
 * @returns {string} HTML string for the priority icon.
 */
function getPriorityIcon(priority) {
    if (!priority) return "";
    const validPriorities = ["low", "medium", "urgent"];
    const cleanPriority = priority.toLowerCase();
    if (!validPriorities.includes(cleanPriority)) return "";
    return priorityRender(cleanPriority);
}

/**
 * Clears all task columns before re-rendering cards.
 */
function clearAllTaskLists() {
    const columns = [
        "tasks-list-open",
        "tasks-list-inprogress",
        "tasks-list-awaitfeedback",
        "tasks-list-done"
    ];
    columns.forEach(id => {
        const column = document.getElementById(id);
        if (column) column.innerHTML = "";
    });
}

/**
 * Renders all tasks to their appropriate columns.
 * @param {Object} tasksObject - Task ID mapped to task data.
 */
function renderAllTasks() {
    clearAllTaskLists();
    displayedTasks.forEach((task, displayedTasksId) => {
        let tasksId = tasks.indexOf(task);
        let columnId = getColumnIdByStatus(task.status);
        if (columnId) {
            renderTaskToColumn(tasksId, displayedTasksId, task, columnId);
        }
    });
    checkColumnsAddEvents();
}

/**
 * Renders a single task card to its corresponding column.
 * @param {number} taskId - The index of the task in the main tasks array.
 * @param {number} displayedTasksId - The index in the filtered/displayed task list.
 * @param {Object} task - The task data object.
 * @param {string} columnId - The ID of the column to render into.
 */
function renderTaskToColumn(taskId, displayedTasksId, task, columnId) {
    const container = document.getElementById(columnId);
    if (!container) return console.warn(`Column with ID '${columnId}' not found.`);
    const avatarsHTML = renderAssignedAvatars(task['assigned-to']);
    const progress = getSubtaskProgress(task.subtasks);
    container.innerHTML += cardRender(taskId, displayedTasksId, task, avatarsHTML, progress);
}

/**
 * Initializes the board view:
 * - Loads tasks and contacts via init()
 * - Builds contactsMap (name → color & initials)
 * - Converts tasks array into object format
 * - Renders all tasks
 * @async
 */
async function initBoardView() {
    await init();
    window.contactsMap = {};
    contacts.forEach(contact => {
        const fullName = `${contact.name["first-name"]} ${contact.name["last-name"]}`.trim();
        contactsMap[fullName] = {
            color: contact.color,
            initials: getInitials(fullName)
        };
    });
    renderAllTasks();
}