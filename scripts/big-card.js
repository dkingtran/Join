/**
 * Opens a big card overlay for the given Firebase task ID.
 */
function openBigCard(taskId) {
/*   if (dragged) {
    e.preventDefault();
    return;
  } */
  const task = findTaskById(taskId);
  if (!task) return;
  const avatarsHTML = buildAvatarsHTML(task);
  const subtasks = normalizeSubtasks(task);
  const subtasksHTML = buildSubtasksHTML(taskId, subtasks);
  const bigCardHTML = bigCardTemplate(
    taskId, task.category || "", task.title || "", task.description || "",
    task["due-date"] || task.due || task.date || "", task.priority || "",
    avatarsHTML, subtasksHTML
  );
  showBigCard(bigCardHTML);
}

/**
 * Finds a task in displayedTasks by its Firebase ID.
 */
function findTaskById(taskId) {
  if (!Array.isArray(displayedTasks)) return null;
  for (let i = 0; i < displayedTasks.length; i++) {
    if (displayedTasks[i].id === taskId) return displayedTasks[i];
  }
  return null;
}

/**
 * Shows the given big card HTML in the overlay container.
 * Replaces old content and removes the "d-none" class.
 */
function showBigCard(bigCardHTML) {
  const container = document.getElementById("big-card-container");
  if (!container) return;
  container.innerHTML = bigCardHTML;
  container.classList.remove("d-none");
  console.log("Container before:", container);

}

/**
 * Builds avatar HTML with proper color conversion.
 */
function buildAvatarsHTML(task) {
  const users = Array.isArray(task["assigned-to"]) ? task["assigned-to"] : [];
  let html = "";
  for (let i = 0; i < users.length; i++) {
    const fullName = users[i];
    const contact = contacts.find(c => {
      const name = `${c.name["first-name"]} ${c.name["last-name"]}`;
      return name === fullName;
    });
    let color = contact && contact.color
      ? (contact.color.startsWith("bg-") ? "#" + contact.color.slice(3) : contact.color)
      : "#B5C0D0";
    html += avatarItemTemplate(getInitials(fullName), color, fullName);
  }
  return html;
}


/**
 * Normalizes Firebase subtasks into array of {id, text, done}.
 */
/**
 * Normalizes Firebase subtasks into array of {id, text, done}.
 */
function normalizeSubtasks(task) {
  const list = [];
  const subs = task.subtasks || {};
  for (const key in subs) {
    if (subs.hasOwnProperty(key)) {
      const entry = subs[key];
      const text = entry && typeof entry.subtask === "string"
        ? entry.subtask
        : "";
      const done = entry && typeof entry.done === "boolean"
        ? entry.done
        : false;
      list.push({ id: key, text: text, done: done });
    }
  }
  return list;
}

/**
 * Updates only the "done" state of a subtask in Firebase.
 */
async function toggleSubtaskDone(checkbox) {
  const taskId = checkbox.dataset.taskId;
  const subtaskId = checkbox.dataset.subtaskId;
  const isDone = checkbox.checked;
  try {
    await putData(`/tasks/${taskId}/subtasks/${subtaskId}/done`, isDone);
    console.log("Subtask state saved:", subtaskId, isDone);
  } catch (err) {
    console.error("Failed to save subtask:", err);
  }
}

/**
 * Builds HTML for all subtasks using the template.
 */
function buildSubtasksHTML(taskId, subtasks) {
  let html = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    html += subtaskItemTemplate(
      taskId,
      subtask.id,
      subtask.text,
      subtask.done
    );
  }
  return html;
}

/**
 * Close big Card
 */
function closeBigCard() {
  const container = document.getElementById("big-card-container")
  if (container) {
    container.innerHTML = "";
    container.classList.add("d-none");
  }
}

/**
 * closed overlay when you click by side
 */
function closeBigCardOverlay(event) {
  if (event.target.id === "big-card-container") {
    closeBigCard();
  }
}

/**
 * Delete complete Task in Firebase
 */
async function deleteTaskBigCard(taskId) {
  if (!confirm("You will Kill this Task? Real? Wow?")) return;
  try {
    await deleteData(`/tasks/${taskId}`);
    closeBigCard();
    await init(); // Board aktualisieren
  } catch (err) {
    console.error("Fehler beim Löschen:", err);
  }
}

/**
 * Updates the "done" status of a subtask in Firebase
 * when its checkbox in the UI is toggled.
 * @param {HTMLInputElement} checkboxElement - The checkbox element of the subtask.
 */
async function toggleSubtaskDone(checkboxElement) {
  const taskId = checkboxElement.getAttribute("data-task-id");
  const subtaskId = checkboxElement.getAttribute("data-subtask-id");
  const isSubtaskDone = checkboxElement.checked;
  const firebasePath = `tasks/${taskId}/subtasks/${subtaskId}/done`;
  try {
    await putData(firebasePath, isSubtaskDone);
  } catch (error) {
    console.error("Error updating subtask in Firebase:", error);
  }
}

/**
 * Applies the "done" states from Firebase to the subtask checkboxes
 * inside a task detail view (Big Card).
 * @param {string} taskId - The ID of the task.
 * @param {Object} subtasksObj - The object containing all subtasks of the task.
 */
function applySubtaskDoneStates(taskId, subtasksObj) {
  if (!subtasksObj) return;
  const subtaskIds = Object.keys(subtasksObj);
  for (let i = 0; i < subtaskIds.length; i++) {
    const subtaskId = subtaskIds[i];
    const isSubtaskDone = !!subtasksObj[subtaskId].done;
    const checkbox = document.getElementById(`subtask-${taskId}-${subtaskId}`);
    if (checkbox) checkbox.checked = isSubtaskDone;
  }
}


function openEditCard() {
  const overlay = document.getElementById("edit-task-overlay");
  overlay.classList.remove("d-none");

  overlay.onclick = function (event) {
    if (event.target === overlay) {
      closeEditCard();
    }
  };
}

function closeEditCard() {
  document.getElementById("edit-task-overlay").classList.add("d-none");
}
