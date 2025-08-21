let _currentTaskId = null; // merkt sich die zuletzt geöffnete Big Card

/**
 * Opens a big task card overlay with all task details.
 * @param {string} displayTaskId - Unique ID of the task to display.
 */
function openBigTask(displayTaskId) {
  const overlay = document.getElementById('big-card-container');
  const tasks = window.allTasks || {};
  const task = tasks[displayTaskId];
  if (!overlay || !task) return;
  const avatarsHTML = buildAvatarsHTML(task);
  const subtasksHTML = buildSubtasksHTML(task, displayTaskId);
  overlay.innerHTML = bigCardTemplate(
    displayTaskId, task.category, task.title, task.description,
    task['due-date'], task.priority, avatarsHTML, subtasksHTML
  );
  overlay.classList.remove('d-none');
}


/**
 * Builds HTML for all assigned user avatars of a task.
 * @param {Object} task - The task object containing "assigned-to".
 * @returns {string} HTML string with all avatars.
 */
function buildAvatarsHTML(task) {
  let avatarsHTML = '';
  const assignedUsers = Array.isArray(task['assigned-to']) ? task['assigned-to'] : [];
  for (let index = 0; index < assignedUsers.length; index++) {
    const fullName = assignedUsers[index];
    const initials = getInitials ? getInitials(fullName) : fullName.slice(0, 2).toUpperCase();
    avatarsHTML += avatarItemTemplate(initials, '#A8A8A8', fullName);
  }
  return avatarsHTML;
}

