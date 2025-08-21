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
 * Builds HTML for assigned avatars using contact IDs resolved via allContacts.
 * @param {Object} task - Task object with "assigned-to" as contact ID array.
 * @returns {string} HTML string with avatars.
 */
function buildAvatarsHTML(task) {
  let html = '';
  const ids = Array.isArray(task['assigned-to']) ? task['assigned-to'] : [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const c = (typeof allContacts === 'object' && allContacts[id]) ? allContacts[id] : null;
    const fullName = c ? c.fullName : String(id);
    const initials = c ? c.initials : (getInitials ? getInitials(fullName) : fullName.slice(0, 2).toUpperCase());
    const hexColor = c ? c.hexColor : '#A8A8A8';
    html += avatarItemTemplate(initials, hexColor, fullName);
  }
  return html;
}

/**
 * Builds HTML for the subtask checklist in the big card.
 * @param {Object} task - Task object containing optional `subtasks`.
 * @param {string} displayTaskId - ID used to namespace checkbox elements.
 * @returns {string} HTML string with all subtasks.
 */
function buildSubtasksHTML(task, displayTaskId) {
  let html = '';
  const list = Array.isArray(task.subtasks) ? task.subtasks : [];
  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    const text = (item && item.text) ? item.text : String(item ?? '');
    const done = !!(item && item.done);
    html += subtaskItemTemplate(displayTaskId, index, text, done);
  }
  return html;
}

/** Caches contacts keyed by full name for fast lookup in big card. */
async function cacheContactsByName() {
  const data = await loadData('contacts');
  if (!data || typeof data !== 'object') { allContactsByName = {}; return; }
  const ids = Object.keys(data); allContactsByName = {};
  for (let i = 0; i < ids.length; i++) {
    const c = data[ids[i]] || {}, n = c.name || {};
    const fn = n['first-name'] || '', ln = n['last-name'] || '';
    const full = (fn + ' ' + ln).trim();
    const ini = ((fn[0] || '') + (ln[0] || '')).toUpperCase();
    const hex = '#' + String(c.color || 'bg-cccccc').replace('bg-', '');
    allContactsByName[full] = { fullName: full, initials: ini, hexColor: hex };
  }
}

