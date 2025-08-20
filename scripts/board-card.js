const assignedColorMap = {};
let colorIndex = 0;

const avatarColors = [
    'contact-avatar-color1',
    'contact-avatar-color2',
    'contact-avatar-color3',
    'contact-avatar-color4',
    'contact-avatar-color5',
    'contact-avatar-color6',
    'contact-avatar-color7',
    'contact-avatar-color8',
    'contact-avatar-color9',
    'contact-avatar-color10'
];

function getColorForName(name) {
    if (!assignedColorMap[name]) {
        assignedColorMap[name] = avatarColors[colorIndex];
        colorIndex = (colorIndex + 1) % avatarColors.length;
    }
    return assignedColorMap[name];
}

async function loadTasksFromFirebase() {
    const tasks = await loadData("tasks");
    if (!tasks || typeof tasks !== "object") {
        console.warn("Keine Aufgaben vorhanden oder Daten ungültig.");
        return;
    }
    diagnoseTasksObject(tasks);   // 👈 Diagnose hier einfügen
    renderAllTasks(tasks);
}

function renderAllTasks(tasksObject) {
    clearAllTaskLists();
    for (const taskId in tasksObject) {
        const task = tasksObject[taskId];
        const columnId = getColumnIdByStatus(task.status);
        if (columnId) renderTaskToColumn(task, columnId, taskId);
    }
}

const statusToColumnId = {
    "to-do": "tasks-list-open",
    "in-progress": "tasks-list-inprogress",
    "feedback": "tasks-list-awaitfeedback",
    "done": "tasks-list-done"
};

function getColumnIdByStatus(statusObj) {
    if (!statusObj || typeof statusObj !== "object") return null;
    for (const status in statusObj) {
        if (statusObj[status] === true && statusToColumnId[status]) {
            return statusToColumnId[status];
        }
    }
    return null;
}

//neu
function renderTaskToColumn(task, columnId, taskId) {
    const container = document.getElementById(columnId);
    if (!container) return console.warn(`Spalte '${columnId}' nicht gefunden`);
    if (!taskId) return console.warn("Keine taskId für Task:", task);
    const avatars = renderAssignedAvatars(task["assigned-to"]);
    const p = getSubtaskProgress(task.subtasks);
    const card = document.createElement("div");
    card.classList.add("board-card");
    card.dataset.taskId = taskId;
    card.innerHTML = cardRender(task, avatars, p.progressPercent, p.maxSubtasks, p.total, "#4589FF");
    container.appendChild(card);
    attachOpenBigCard(card, taskId);
}

function renderAssignedAvatars(users = []) {
    return users.map(name => {
        const initials = getInitials(name);
        const colorClass = getColorForName(name);
        return `<div class="avatar ${colorClass}">${initials}</div>`;
    }).join("");
}

function getSubtaskProgress(subtasks = []) {
    const list = Array.isArray(subtasks) ? subtasks : [];
    const maxSubtasks = 2;
    const total = Math.min(list.length, maxSubtasks);
    const progressPercent = (total / maxSubtasks) * 100;
    return { progressPercent, total, maxSubtasks };
}

function getCategoryClass(category) {
    if (!category) return "category-default";
    if (category.toLowerCase() === "technical task") {
        return "category-technical";
    }
    return "category-default";
}

function getPriorityIcon(priority) {
    if (!priority) return "";
    const validPriorities = ["low", "medium", "urgent"];
    const cleanPriority = priority.toLowerCase();
    if (!validPriorities.includes(cleanPriority)) return "";
    return priorityRender(cleanPriority);
}

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

function diagnoseTasksObject(tasksObject) {
    const keys = Object.keys(tasksObject || {});
}

