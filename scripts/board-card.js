async function loadTasksFromFirebase() {
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
  if (!container) {
    console.warn(`Spalte mit ID '${columnId}' nicht gefunden.`);
    return;
  }

  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const maxSubtasks = 2;
  const total = Math.min(subtasks.length, maxSubtasks);
  const progressPercent = (total / maxSubtasks) * 100;

  
  let progressColor = "#4589FF"; 

  const card = document.createElement("div");
  card.classList.add("board-card");

  card.innerHTML = `
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
        <div class="assigned-user">${(task["assigned-to"] || []).join(", ")}</div>
        <div class="priority">
            ${getPriorityIcon(task.priority)}
        </div>
    </div>
  `;

  container.appendChild(card);
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

    return `<img src="./assets/img/icons/priority-icons/${cleanPriority}.png" 
                alt="${cleanPriority} priority" 
                class="priority-icon" />`;
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