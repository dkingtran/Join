/**
 * Opens a big card overlay for the given Firebase task ID.
 */
function openBigCard(taskId) {
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
  const container = document.getElementById("big-card-container");
  if (container) {
    container.innerHTML = "";
    container.classList.add("d-none");
  }
}

function closeBigCardOverlay(event) {
  if (event.target.id === "big-card-container") {
    closeBigCard();
  }
}
