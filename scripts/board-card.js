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
  await cacheContactsByName();   // <<< NEU hinzugefügt allContactsByName gespeichert sind
  const tasks = await loadData("tasks");
  if (!tasks || typeof tasks !== "object") {
    console.warn("Keine Aufgaben vorhanden oder Daten ungültig.");
    return;
  }
  allTasks = tasks;              // (window. habe ich weggelassen allTasks ist sowieso global, man braucht kein window)
  renderAllTasks(tasks);
}


/**
 * Renders all tasks to their target columns.
 * @param {Object} tasksObject - Map of taskId -> task object.
 */
function renderAllTasks(tasksObject) {
    clearAllTaskLists();
    for (const taskId in tasksObject) {
        const task = tasksObject[taskId];
        const columnId = getColumnIdByStatus(task.status);
        if (columnId) {
        renderTaskToColumn(taskId,task, columnId);
        }
    }

    console.log(tasksObject);
    
    // Rufe die "No Tasks"-Rendering-Funktion auf
    if (typeof renderWithNoTasksAreas === 'function') {
        renderWithNoTasksAreas();
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

/**
 * Renders a single task card into its column.
 * @param {string} taskId - Display task ID to pass into the template.
 * @param {Object} task - Task data object.
 * @param {string} columnId - Target column element ID.
 */
function renderTaskToColumn(taskId, task, columnId) {
  const container = document.getElementById(columnId);
  if (!container) return console.warn(`Spalte mit ID '${columnId}' nicht gefunden.`);
  const avatarsHTML = renderAssignedAvatars(task['assigned-to']);
  const progress = getSubtaskProgress(task.subtasks);
  const card = document.createElement('div');
  card.classList.add('board-card');
  card.innerHTML = cardRender(taskId, task, avatarsHTML, progress.progressPercent, progress.maxSubtasks, progress.total, '#4589FF');
  container.appendChild(card);
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