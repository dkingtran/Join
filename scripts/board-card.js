/*const assignedColorMap = {}; 
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
];*/

let contactsMap = {};

/*function getColorForName(name) {
    if (!assignedColorMap[name]) {
        assignedColorMap[name] = avatarColors[colorIndex];
        colorIndex = (colorIndex + 1) % avatarColors.length;
    }
    return assignedColorMap[name];
}*/

async function loadContactsFromFirebase() {
    const contactsData = await loadData("contacts");
    if (contactsData && typeof contactsData === "object") {
        for (const contactId in contactsData) {
            const contact = contactsData[contactId];
            const fullName = `${contact.name["first-name"]} ${contact.name["last-name"]}`.trim();
            contactsMap[fullName] = {
                color: contact.color, // e.g. "bg-9327ff"
                initials: getInitials(fullName)
            };
        }
    } else {
        console.warn("Keine Kontakte geladen oder Daten ungültig.");
    }
}

async function loadTasksFromFirebase() {
    await loadContactsFromFirebase();
    const tasks = await loadData("tasks");
    if (!tasks || typeof tasks !== "object") {
        console.warn("Keine Aufgaben vorhanden oder Daten ungültig.");
        return;
    }
    renderAllTasks(tasks);
}

function renderAllTasks(tasksObject) {
    clearAllTaskLists();
    for (const taskId in tasksObject) {
        const task = tasksObject[taskId];
        const columnId = getColumnIdByStatus(task.status);
        if (columnId) {
        renderTaskToColumn(task, columnId);
        }
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

function renderTaskToColumn(task, columnId) {
    const container = document.getElementById(columnId);
    if (!container) return console.warn(`Spalte mit ID '${columnId}' nicht gefunden.`);
    const avatars = renderAssignedAvatars(task["assigned-to"]);
    const { progressPercent, total, maxSubtasks } = getSubtaskProgress(task.subtasks);
    const card = document.createElement("div");
    card.classList.add("board-card");
    card.innerHTML = cardRender(task, avatars, progressPercent, maxSubtasks, total, "#4589FF");
    container.appendChild(card);
}

function getContactByName(fullName) {
    return contactsMap[fullName] || null;
}

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

function renderSingleAvatar(name) {
    const contact = getContactByName(name);
    const initials = getInitials(name);
    const color = contact?.color || "fallback-gray";
    return `<div class="avatar ${color}" title="${name}">${initials}</div>`;
}

function renderOverflowAvatar(users) {
    const tooltip = users.join(", ");
    return `
        <div class="avatar overflow-avatar">
            +${users.length}
            <div class="custom-tooltip">${tooltip}</div>
        </div>
    `;
}

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