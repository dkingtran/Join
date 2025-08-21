let allContactsByName = {};

/**
 * Lädt alle Kontakte aus Firebase und speichert sie
 * als Map mit vollem Namen → { fullName, initials, hexColor }.
 */
async function cacheContactsByName() {
  const contactsData = await loadData('contacts');
  if (!contactsData || typeof contactsData !== 'object') {
    allContactsByName = {};
    return;
  }
  const contactIds = Object.keys(contactsData);
  allContactsByName = {};
  for (let i = 0; i < contactIds.length; i++) {
    const contact = contactsData[contactIds[i]] || {};
    const name = contact.name || {};
    const firstName = name['first-name'] || '';
    const lastName = name['last-name'] || '';
    const fullName = (firstName + ' ' + lastName).trim();
    const initials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase();
    const hexColor = '#' + String(contact.color || 'bg-cccccc').replace('bg-', '');
    allContactsByName[fullName] = { fullName, initials, hexColor };
  }
}

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
 * Builds HTML for all assigned user avatars of a task using allContactsByName.
 * @param {Object} task - The task object containing "assigned-to".
 * @returns {string} HTML string with all avatars.
 */
function buildAvatarsHTML(task) {
  let avatarsHTML = '';
  const assignedUsers = Array.isArray(task['assigned-to']) ? task['assigned-to'] : [];
  for (let index = 0; index < assignedUsers.length; index++) {
    const fullName = assignedUsers[index];
    const contact = allContactsByName && allContactsByName[fullName] ? allContactsByName[fullName] : null;
    const initials = contact ? contact.initials : (getInitials ? getInitials(fullName) : fullName.slice(0, 2).toUpperCase());
    const hexColor = contact ? contact.hexColor : '#A8A8A8';
    avatarsHTML += avatarItemTemplate(initials, hexColor, fullName);
  }
  return avatarsHTML;
}

/**
 * Builds HTML for all subtasks (works with arrays and objects).
 * @param {Object} task - Task object with `subtasks`.
 * @param {string} displayTaskId - ID for checkbox namespacing.
 * @returns {string} HTML string with subtasks.
 */
function buildSubtasksHTML(task, displayTaskId) {
  let html = '';
  const list = task && task.subtasks ? Object.values(task.subtasks) : [];
  for (let i = 0; i < list.length; i++) {
    const sub = list[i] || {};
    const txt = sub.subtask || sub.text || '';
    const done = !!sub.done; // true or false
    console.log(done);
    html += subtaskItemTemplate(displayTaskId, i, txt, done);
  }
  return html;
}

/** 
 * Caches all contacts, keyed by full name, for fast avatar rendering in big card. 
 */
/** Caches contacts keyed by full name for big-card avatars. */
async function cacheContactsByName() {
  const contactsData = await loadData('contacts');
  if (!contactsData || typeof contactsData !== 'object') { allContactsByName = {}; return; }
  const contactIds = Object.keys(contactsData); allContactsByName = {};
  for (let i = 0; i < contactIds.length; i++) {
    const contact = contactsData[contactIds[i]] || {};
    const name = contact.name || {};
    const firstName = name['first-name'] || '';
    const lastName = name['last-name'] || '';
    const fullName = (firstName + ' ' + lastName).trim();
    const initials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase();
    const hexColor = '#' + String(contact.color || 'bg-cccccc').replace('bg-', '');
    allContactsByName[fullName] = { fullName, initials, hexColor };
  }
}


