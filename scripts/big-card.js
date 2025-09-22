/**
 * Opens a big card overlay for the given Firebase task ID.
 */
function openBigCard(taskId) {
  if (dragged) {
    e.preventDefault();
    return;
  }
  const task = displayedTasks[taskId];
  if (!task) return;
  const avatarsHTML = buildAvatarsHTML(task);
  const subtasks = normalizeSubtasks(task);
  const subtasksHTML = buildSubtasksHTML(task.id, subtasks);
  const bigCardHTML = bigCardTemplate(
    task.id, task.category || "", task.title || "", task.description || "",
    task["due-date"] || task.due || task.date || "", task.priority || "",
    avatarsHTML, subtasksHTML
  );
  showBigCard(bigCardHTML);
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
  const card = container.querySelector(".big-card-content");
  requestAnimationFrame(() => {
    card.classList.add("show");
  });

  document.body.style.overflow = "hidden";
}

/**
 * Builds avatar HTML for all users in task["assigned-to"].
 * @param {Object} task
 * @returns {string} HTML string of avatar items
 */
function buildAvatarsHTML(task) {
  const users = Array.isArray(task["assigned-to"]) ? task["assigned-to"] : [];
  let html = "";
  for (let i = 0; i < users.length; i++) {
    const fullName = users[i];
    const contact = contacts.find(c => `${c.name["first-name"]} ${c.name["last-name"]}` === fullName);
    let color = "#B5C0D0";
    if (contact && contact.color) {
      color = contact.color.startsWith("bg-") ? `#${contact.color.slice(3)}` : contact.color;
    }
    html += avatarItemTemplate(getInitials(fullName), color, fullName);
  }
  return html;
}

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
 * Updates the "done" state of a subtask in Firebase.
 * @param {HTMLInputElement} checkbox - The checkbox element of the subtask.
 */
async function toggleSubtaskDone(checkbox) {
  const taskId = checkbox.dataset.taskId, subId = checkbox.dataset.subtaskId, isDone = checkbox.checked;
  try {
    await putData(`/tasks/${taskId}/subtasks/${subId}/done`, isDone);
    const t = Array.isArray(displayedTasks) ? displayedTasks.find(x => x?.id === taskId) : displayedTasks[taskId];
    if (t?.subtasks?.[subId]) t.subtasks[subId].done = isDone; 
    renderAllTasks();                
    if (t) renderBigCard(taskId, t);  
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
  document.body.style.overflow = ""; 
}

/**
 * Closes the Big Card only when the backdrop itself is clicked.
 * Ignores clicks inside the content. Safe if container or event is missing.
 * @param {MouseEvent} e
 */
function closeBigCardOverlay(e) {
  const container = document.getElementById("big-card-container");
  if (!container || !e) return;
  if (e.target === container) {
    closeBigCard();
  }
}

/**
 * Delete complete Task in Firebase
 */
async function deleteTaskBigCard(taskId) {
  if (!confirm("Delete this task?")) return;
  try {
    await deleteData(`/tasks/${taskId}`);
    if (Array.isArray(displayedTasks))
      displayedTasks = displayedTasks.filter(t => t?.id !== taskId);
    else if (displayedTasks && displayedTasks[taskId]) delete displayedTasks[taskId];
    closeBigCard();
    renderAllTasks(); // Mini-Cards sofort neu
  } catch (err) {
    console.error("Failed to delete task:", err);
  }
}

/**
 * Opens the edit-task overlay and attaches a click handler
 * to close it when clicking outside the content area.
 */
function openEditCard() {
  const overlay = document.getElementById("edit-task-overlay");
  overlay.classList.remove("d-none");

  overlay.onclick = function (event) {
    if (event.target === overlay) {
      closeEditCard();
    }
  };
}

/**
 * Closes the edit-task overlay.
 */
function closeEditCard() {
  document.getElementById("edit-task-overlay").classList.add("d-none");
}


function updateTaskCache(taskId, updated) {
  if (!updated || !Array.isArray(displayedTasks)) return;
  for (let i = 0; i < displayedTasks.length; i++) {
    const t = displayedTasks[i];
    if (t && t.id === taskId) {
      displayedTasks[i] = { id: taskId, ...t, ...updated };
      return;
    }
  }
}

/**
 * Renders a detailed "big card" view for a given task.
 * @param {string|number} taskId - Unique identifier of the task.
 * @param {Object} taskObj - Task object containing all task details.
 * @returns {void}
 */
function renderBigCard(taskId, taskObj) {
  if (!taskObj) return;
  const avatarsHTML = buildAvatarsHTML(taskObj);
  const subs = taskObj.subtasks ? normalizeSubtasks(taskObj) : [];
  const bigCardHTML = bigCardTemplate(
    taskId,
    taskObj.category || "",
    taskObj.title || "",
    taskObj.description || "",
    taskObj["due-date"] || taskObj.due || taskObj.date || "",
    taskObj.priority || "",
    avatarsHTML,
    buildSubtasksHTML(taskId, subs)
  );
  showBigCard(bigCardHTML);
}
