function openEditCard() {
  const overlay = document.getElementById("edit-task-overlay");
  overlay.classList.remove("d-none");
  document.body.classList.add("no-scroll");
  overlay.onclick = function (event) {
    if (event.target === overlay) closeEditCard();
  };
}

function closeEditCard() {
  const overlay = document.getElementById("edit-task-overlay");
  overlay.classList.add("d-none");
  document.body.classList.remove("no-scroll");
  // Reset checkboxes to prevent state contamination
  const checkboxes = overlay.querySelectorAll('.contact-checkbox');
  checkboxes.forEach(cb => cb.checked = false);
}

function showEditTaskBig() {
  const editCardBigRef = document.getElementById("edit-task-content");
  editCardBigRef.innerHTML = editTasktemplateBig();
}

async function loadContactsIntoDropdownOverlay() {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const list = overlay.querySelector('#contactList');
  if (!list) return;
  list.innerHTML = '';
  if (!contacts.length) await getContactsArray();
  for (let i = 0; i < contacts.length; i++) {
    const prepared = prepareContactData(contacts[i]);
    list.insertAdjacentHTML('beforeend',
      getAssignedNameTemplateOverlay(prepared.initials, prepared.name, prepared.hexColor));
  }
}

function findTask(taskId) {
  return Array.isArray(displayedTasks)
    ? displayedTasks.find(t => t?.id === taskId)
    : displayedTasks?.[taskId];
}

function setupEditOverlay(task) {
  window.currentEditingTask = task;
  if (typeof closeBigCard === "function") closeBigCard();
  openEditCard();
  showEditTaskBig();
}

async function loadEditData(task) {
  prefillEditForm(task);
  bindOverlayPrio();
  await loadContactsIntoDropdownOverlay();
  prefillAssignedFromTaskOverlay(task);
  prefillSubtasksFromTaskOverlay(task);
  bindEditOverlayButton(task.id);
}

/** Opens the edit overlay for a task, renders the form, loads contacts and subtasks, then pre-fills fields.  
 * @param {string} taskId - The Firebase ID of the task to edit. */
async function openEditCardFor(taskId) {
  const task = findTask(taskId);
  if (!task) return;
  setupEditOverlay(task);
  await loadEditData(task);
}

function prefillFields(task) {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const titleInput = overlay.querySelector('#title-task');
  if (titleInput) titleInput.value = task.title || '';
  const descInput = overlay.querySelector('#task-description');
  if (descInput) descInput.value = task.description || '';
  const due = task['due-date'] || task.due || task.date || '';
  const dateInput = overlay.querySelector('#task-date');
  if (dateInput) dateInput.value = due ? String(due).slice(0, 10) : '';
}

function prefillPriority(task) {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const ids = ['urgent', 'medium', 'low'];
  for (let i = 0; i < ids.length; i++) {
    const btn = overlay.querySelector('#' + ids[i]);
    if (btn) btn.classList.remove('active-red', 'active-yellow', 'active-green');
  }
  const pr = (task.priority || '').toLowerCase();
  if (pr === 'urgent') overlay.querySelector('#urgent')?.classList.add('active-red');
  if (pr === 'medium') overlay.querySelector('#medium')?.classList.add('active-yellow');
  if (pr === 'low') overlay.querySelector('#low')?.classList.add('active-green');
}

/** Wrapper that fills all edit form fields (title, description, date, priority) in the overlay. */
function prefillEditForm(task) {
  prefillFields(task);
  prefillPriority(task);
}

function collectBasicData(overlay) {
  const $ = s => overlay.querySelector(s);
  const title = $('#title-task')?.value.trim() || '';
  const description = $('#task-description')?.value.trim() || '';
  const dueDate = $('#task-date')?.value || '';
  const priority = ['urgent', 'medium', 'low'].find(id => {
    const btn = $('#' + id);
    return btn?.classList.contains('active-red') || btn?.classList.contains('active-yellow') || btn?.classList.contains('active-green');
  }) || '';
  return { title, description, dueDate, priority };
}

/** Collects all form values from the edit overlay (title, description, due date, priority, assigned).  
 * @returns {Object} Form data object with title, description, due-date, priority, and assigned-to array. */
function collectEditFormData(overlay = document.getElementById('edit-task-content')) {
  if (!overlay) return { title: '', description: '', "due-date": '', priority: '', "assigned-to": [] };
  const basic = collectBasicData(overlay);
  const assigned = collectAssigned(overlay);
  return { title: basic.title, description: basic.description, "due-date": basic.dueDate, priority: basic.priority, "assigned-to": assigned };
}

/** Binds the OK button in the edit overlay to submit the form and attach its handler.  
 * @param {string} taskId - The Firebase ID of the task being edited. */
function bindEditOverlayButton(taskId) {
  const overlay = document.getElementById('edit-task-content');
  const form = overlay?.querySelector('#form-element');
  const button = overlay?.querySelector('.edit-add-task-button-container button');
  if (!form || !button) return;
  button.onclick = e => { e.preventDefault(); form.requestSubmit(); };
  bindEditOverlayFormSubmit(taskId);
}

/** Updates Firebase with form fields and subtasks, then closes the overlay.  
 * @param {string} taskId - The Firebase ID of the task being updated. */
function bindEditOverlayFormSubmit(taskId) {
  const overlay = document.getElementById('edit-task-content'), form = overlay?.querySelector('#form-element'); if (!form) return;
  form.onsubmit = async e => {
    e.preventDefault();
    const data = collectEditFormData(overlay), subs = collectSubtasksFromOverlay(overlay);
    const f = ['title', 'description', 'due-date', 'priority', 'assigned-to'];
    await Promise.all(f.map(n => putData(`/tasks/${taskId}/${n}`, data[n])));
    await putData(`/tasks/${taskId}/subtasks`, subs);
    updateTaskCache(taskId, { ...data, subtasks: subs });
    renderAllTasks();
    closeEditCard();
    const t = Array.isArray(displayedTasks) ? displayedTasks.find(x => x?.id === taskId) : displayedTasks[taskId];
    renderBigCard(taskId, t || { id: taskId, ...data, subtasks: subs });
  };
}

/** Renders the task's existing subtasks into the edit overlay list.  
 * @param {Object} task - Task object containing a `subtasks` map. */
function prefillSubtasksFromTaskOverlay(task) {
  const out = document.querySelector('#edit-task-content #subtask-output');
  if (!out) return;
  out.innerHTML = '';

  Object.entries(task?.subtasks || {}).forEach(([id, { subtask = '', done = false }]) => {
    out.insertAdjacentHTML('beforeend', getSubtaskTemplateOverlay(subtask, id, done));
  });
}

/** Shows the active subtask input inside the EDIT overlay */
function showSubtaskInputOverlay() {
  const overlay = document.getElementById('edit-task-content'); if (!overlay) return;
  const initialRow = overlay.querySelector('#subtask-initial');
  const activeRow = overlay.querySelector('#subtask-active');
  if (initialRow) initialRow.classList.add('d-none');
  if (activeRow) activeRow.classList.remove('d-none');
  const inputField = overlay.querySelector('#subtask-input-second');
  if (inputField) inputField.focus();
}

/** Confirms and adds a new subtask inside the EDIT overlay */
function confirmSubtaskInputOverlay() {
  const overlay = document.getElementById('edit-task-content');
  const inputField = overlay?.querySelector('#subtask-input-second');
  if (!inputField) return;
  const subtaskText = inputField.value.trim();
  if (!subtaskText) return alert('Please enter a subtask.');
  overlay.querySelector('#subtask-output')
    ?.insertAdjacentHTML('beforeend', getSubtaskTemplateOverlay(subtaskText));
  inputField.value = '';
  overlay.querySelector('#subtask-active')?.classList.add('d-none');
  overlay.querySelector('#subtask-initial')?.classList.remove('d-none');
}

window.startEditSubtaskOverlay = startEditSubtaskOverlay;
window.deleteSubtaskOverlay = deleteSubtaskOverlay;
window.finishEditSubtaskOverlay = finishEditSubtaskOverlay;
window.openEditCardFor = openEditCardFor;