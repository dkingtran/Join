/** Opens the overlay and disables body scroll */
function openEditCard() {
  const overlay = document.getElementById("edit-task-overlay");
  overlay.classList.remove("d-none");
  document.body.classList.add("no-scroll");
  overlay.onclick = function (event) {
    if (event.target === overlay) closeEditCard();
  };
}

/**
 * Toggles the visibility of the contact dropdown inside the edit-task overlay.
 * Also rotates the dropdown arrow to indicate state.
 * @param {Event} event - The click event that triggered the toggle.
 *                        Wird meist vom Dropdown-Button im Overlay übergeben.
 */
function toggleDropdownOverlay(event) {
  event.stopPropagation();
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const list = root.querySelector('#contactList'); const arrow = root.querySelector('.assigned-to-container .arrow');
  const vis = list && list.style.display === 'block';
  if (list) list.style.display = vis ? 'none' : 'block';
  if (arrow) arrow.classList.toggle('rotate', !vis);
}

/**
 * Handles clicks inside the overlay to close the contact dropdown
 * when the user clicks outside of the dropdown input or contact items.
 * @param {Event} event - The click event within the overlay. 
 *                        Nutzt `event.target` um zu prüfen, ob der Klick
 *                        außerhalb der relevanten Dropdown-Elemente war.
 */
function handleDropdownClickOverlay(event) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const input = event.target.closest('.dropdown-input'); const item = event.target.closest('.contact-item');
  if (!input && !item) {
    const list = root.querySelector('#contactList'); const arrow = root.querySelector('.assigned-to-container .arrow');
    if (list) list.style.display = 'none'; if (arrow) arrow.classList.remove('rotate');
  }
}

/**
 * Toggles a contact checkbox and its active state in the overlay.
 * @param {HTMLElement} el - Clicked element (checkbox or contact item).
 */
function toggleCheckboxContactOverlay(el) {
  const cont = el.classList.contains('contact-checkbox') ? el.closest('.contact-item') : el;
  const cb = cont.querySelector('.contact-checkbox'); if (!el.classList.contains('contact-checkbox')) cb.checked = !cb.checked;
  cont.classList.toggle('active', cb.checked); updateAssignedListOverlay();
}

/** Rebuild selected avatars + assignedTo (overlay-scoped) */
function updateAssignedListOverlay() {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const out = root.querySelector('#selectedContacts'); if (out) out.innerHTML = '';
  const boxes = root.querySelectorAll('.contact-checkbox'); const sel = [];
  for (let i = 0; i < boxes.length; i++) {
    const cb = boxes[i]; if (cb.checked) {
      sel.push(cb.dataset.name);
      const av = cb.closest('.contact-item').querySelector('.avatar'); const s = document.createElement('span');
      s.className = 'avatar display-standard'; s.style.backgroundColor = av ? av.style.backgroundColor : '#2A3647'; s.textContent = cb.dataset.initials || ''; out.appendChild(s);
    }
  }
  window.assignedTo = sel;
}

/** Closes the overlay and re-enables body scroll */
function closeEditCard() {
  const overlay = document.getElementById("edit-task-overlay");
  overlay.classList.add("d-none");
  document.body.classList.remove("no-scroll");
}

/** Inserts the edit-task template into the overlay */
function showEditTaskBig() {
  const editCardBigRef = document.getElementById("edit-task-content");
  editCardBigRef.innerHTML = editTasktemplateBig();
}

/** Loads contacts into the EDIT overlay (uses overlay handlers) */
async function loadContactsIntoDropdownOverlay() {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const list = root.querySelector('#contactList'); if (!list) return;
  list.innerHTML = '';
  const data = await loadData('contacts'); const arr = Object.values(data);
  for (let i = 0; i < arr.length; i++) {
    const p = prepareContactData(arr[i]); // kommt aus add_task.js
    list.insertAdjacentHTML('beforeend',
      getAssignedNameTemplateOverlay(p.initials, p.name, p.hexColor));
  }
}

/**
 * Toggles the edit/confirm icons in a subtask row.
 * @param {HTMLElement} box - The subtask row element containing the icons.
 */
function toggleSubtaskIcons(box) {
  const icons = box.querySelector('.icon-edit-subtask-box');
  if (!icons) return;
  icons.querySelector('.edit-icon')?.classList.add('d-none');
  icons.querySelector('.confirm-icon')?.classList.remove('d-none');
}

/**
 * Switches a subtask row in the edit overlay into input mode.
 * @param {HTMLElement} el - Clicked element inside the subtask row.
 */
function startEditSubtaskOverlay(el) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const box = el.closest('.subtask-text-box'); if (!box) return;
  const txtEl = box.querySelector('.subtask-entry');
  const txt = (txtEl?.textContent || '').replace(/^•\s*/, '').trim();
  toggleSubtaskIcons(box);
  const input = document.createElement('input');
  input.type = 'text'; input.className = 'subtask-entry font-bundle border-bottom-blue'; input.value = txt;
  input.onkeydown = e => { if (e.key === 'Enter') finishEditSubtaskOverlay(input); };
  if (txtEl) txtEl.replaceWith(input);
}
window.startEditSubtaskOverlay = startEditSubtaskOverlay;

/** Deletes one subtask row inside the EDIT overlay */
function deleteSubtaskOverlay(el) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const box = el.closest('.subtask-text-box'); if (!box) return;
  box.remove(); // entfernt die Subtask-Zeile aus der UI
}
window.deleteSubtaskOverlay = deleteSubtaskOverlay;

/** Finishes subtask edit in the overlay: replaces input with text and resets icons.  
 * @param {HTMLElement} el - The edited input element or a child inside the subtask row. */
function finishEditSubtaskOverlay(el) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const box = el.closest('.subtask-text-box'); if (!box) return;
  const input = (el.tagName === 'INPUT' ? el : box.querySelector('input.subtask-entry')); if (!input) return;
  const txt = (input.value || '').trim();
  const div = document.createElement('div'); div.className = 'subtask-entry font-bundle'; div.textContent = '•' + txt;
  div.onclick = function () { startEditSubtaskOverlay(this); };
  input.replaceWith(div);
  const icons = box.querySelector('.icon-edit-subtask-box');
  if (icons) { icons.querySelector('.edit-icon')?.classList.remove('d-none'); icons.querySelector('.confirm-icon')?.classList.add('d-none'); }
}
window.finishEditSubtaskOverlay = finishEditSubtaskOverlay;

/** Collects subtasks from the edit overlay into an object keyed by timestamp+index. */
function collectSubtasksFromOverlay(root) {
  const result = {};
  const items = root.querySelectorAll('#subtask-output .subtask-entry');
  for (let i = 0; i < items.length; i++) {
    const txt = (items[i].textContent || '').replace(/^•\s*/, '').trim();
    const key = 'subtask_' + Date.now() + '_' + i;
    result[key] = { subtask: txt, done: false };
  }
  return result;
}

/** Collects subtasks from the edit overlay into an object with {subtask, done:false}.  
 * @param {HTMLElement} root - Root element of the edit overlay.  
 * @returns {Object} Subtask collection keyed by timestamp + index. */  
async function updateSubtasksFromOverlay(taskId) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const payload = collectSubtasksFromOverlay(root); // nutzt deine Overlay-Collector-Funktion
  await putData(`/tasks/${taskId}/subtasks`, payload);
}

/** Opens the edit overlay for a task, renders the form, loads contacts and subtasks, then pre-fills fields.  
 * @param {string} taskId - The Firebase ID of the task to edit. */
async function openEditCardFor(taskId) {
  const task = findTaskById(taskId); if (!task) return;
  openEditCard();                 // Overlay zeigen
  showEditTaskBig();              // Template in Overlay
  prefillEditForm(task);      
  bindOverlayPrio();     // Title/Desc/Date/Prio
  await loadContactsIntoDropdownOverlay(); // Kontakte ins Overlay
  prefillAssignedFromTaskOverlay(task);  
  prefillSubtasksFromTaskOverlay(task);
  bindEditOverlayButton(task.id);
}
window.openEditCardFor = openEditCardFor;

/** Setzt Titel, Beschreibung und Datum im Edit-Overlay. */
function prefillEditFormFields(root, task) {
  const titleInput = root.querySelector('#title-task');
  if (titleInput) titleInput.value = task.title || '';
  const descInput = root.querySelector('#task-description');
  if (descInput) descInput.value = task.description || '';
  const due = task['due-date'] || task.due || task.date || '';
  const dateInput = root.querySelector('#task-date');
  if (dateInput) dateInput.value = due ? String(due).slice(0, 10) : '';
}


//By Chat GPT
/** Setzt die Prio-Buttons im Edit-Overlay (reset + markieren). */
function prefillEditFormPriority(root, task) {
  const ids = ['urgent', 'medium', 'low'];
  for (let i = 0; i < ids.length; i++) {
    const btn = root.querySelector('#' + ids[i]);
    if (btn) btn.classList.remove('active-red', 'active-yellow', 'active-green');
  }
  const pr = (task.priority || '').toLowerCase();
  if (pr === 'urgent') root.querySelector('#urgent')?.classList.add('active-red');
  if (pr === 'medium') root.querySelector('#medium')?.classList.add('active-yellow');
  if (pr === 'low') root.querySelector('#low')?.classList.add('active-green');
}

/** Wrapper: befüllt alle Edit-Form-Felder im Overlay. */
function prefillEditForm(task) {
  const root = document.getElementById('edit-task-content');
  if (!root) return;
  prefillEditFormFields(root, task);
  prefillEditFormPriority(root, task);
}

/** Prefills assigned contacts in the overlay by checking boxes and rendering avatars.  
 * @param {Object} task - Task object with an `assigned-to` array of contact names. */

function prefillAssignedFromTaskOverlay(task) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const wanted = Array.isArray(task['assigned-to']) ? task['assigned-to'] : [];
  const items = root.querySelectorAll('.contact-item'); const out = root.querySelector('#selectedContacts'); if (out) out.innerHTML = '';
  for (let i = 0; i < items.length; i++) {
    const cb = items[i].querySelector('.contact-checkbox'); const nameEl = items[i].querySelector('.contact-name');
    const full = (cb?.dataset?.name) || nameEl?.textContent.trim() || ''; const hit = wanted.indexOf(full) !== -1;
    if (cb) { cb.checked = hit; items[i].classList.toggle('active', hit); }
    if (hit && out) {
      const av = items[i].querySelector('.avatar'); const s = document.createElement('span');
      s.className = 'avatar display-standard'; s.style.backgroundColor = av ? av.style.backgroundColor : '#2A3647'; s.textContent = cb?.dataset?.initials || ''; out.appendChild(s);
    }
  }
}

/** Collects all form values from the edit overlay (title, description, due date, priority, assigned).  
 * @param {HTMLElement} root - Root element of the edit overlay.  
 * @returns {Object} Form data object with title, description, due-date, priority, and assigned-to array. */
function collectEditFormData(root) {
  const title = root.querySelector('#title-task')?.value.trim() || '';
  const desc = root.querySelector('#task-description')?.value.trim() || '';
  const due = root.querySelector('#task-date')?.value || '';
  let pr = ''; const ids = ['urgent', 'medium', 'low'];
  for (let i = 0; i < ids.length; i++) {
    const b = root.querySelector('#' + ids[i]); if (b && b.classList.contains('active-red')) pr = 'urgent';
    else if (b && b.classList.contains('active-yellow')) pr = 'medium'; else if (b && b.classList.contains('active-green')) pr = 'low';
  }
  const boxes = root.querySelectorAll('.contact-checkbox'); const names = [];
  for (let i = 0; i < boxes.length; i++) { if (boxes[i].checked) names.push(boxes[i].dataset.name); }
  return { title, description: desc, "due-date": due, priority: pr, "assigned-to": names };
}

/** Binds the OK button in the edit overlay to submit the form and attach its handler.  
 * @param {string} taskId - The Firebase ID of the task being edited. */
function bindEditOverlayButton(taskId) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const form = root.querySelector('#form-element'); if (!form) return;
  const btn = root.querySelector('.edit-add-task-button-container button'); if (!btn) return;
  btn.onclick = function (e) { e.preventDefault(); form.requestSubmit(); };
  bindEditOverlayFormSubmit(taskId); // Teil B (Submit-Handler) folgt
}

/** Attaches the submit handler to the edit overlay form.  
 * Updates Firebase with form fields and subtasks, then closes the overlay.  
 * @param {string} taskId - The Firebase ID of the task being updated. */
function bindEditOverlayFormSubmit(taskId) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const form = root.querySelector('#form-element'); if (!form) return;
  form.onsubmit = async function (e) {
    e.preventDefault();
    const d = collectEditFormData(root);
    const paths = ['title', 'description', 'due-date', 'priority', 'assigned-to'];
    for (let i = 0; i < paths.length; i++) { await putData(`/tasks/${taskId}/${paths[i]}`, d[paths[i]]); }
    await updateSubtasksFromOverlay(taskId);
    closeEditCard(); if (typeof init === 'function') await init();
  };
}

/** Renders the task's existing subtasks into the edit overlay list.  
 * @param {Object} task - Task object containing a `subtasks` map. */
function prefillSubtasksFromTaskOverlay(task) {
  const root = document.getElementById('edit-task-content'); 
  if (!root) return;
  const output = root.querySelector('#subtask-output'); 
  if (!output) return; 
  output.innerHTML = '';
  const subtasks = (task && task.subtasks) ? task.subtasks : {}; 
  const subtaskIds = Object.keys(subtasks);
  for (let i = 0; i < subtaskIds.length; i++) {
    const subtask = subtasks[subtaskIds[i]]; 
    const text = (subtask && subtask.subtask) || '';
    output.insertAdjacentHTML('beforeend', getSubtaskTemplateOverlay(text));
  }
}

/** Shows the active subtask input inside the EDIT overlay */
function showSubtaskInputOverlay() {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const init = root.querySelector('#subtask-initial');
  const active = root.querySelector('#subtask-active');
  if (init) init.classList.add('d-none');
  if (active) active.classList.remove('d-none');
  const input = root.querySelector('#subtask-input-second');
  if (input) input.focus();
}

/** Confirms and adds a new subtask inside the EDIT overlay */
function confirmSubtaskInputOverlay() {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const input = root.querySelector('#subtask-input-second'); if (!input) return;
  const txt = (input.value || '').trim(); if (!txt) { alert('Please enter a subtask.'); return; }
  const out = root.querySelector('#subtask-output'); if (out) out.insertAdjacentHTML('beforeend', getSubtaskTemplateOverlay(txt));
  input.value = '';
  const active = root.querySelector('#subtask-active'); const init = root.querySelector('#subtask-initial');
  if (active) active.classList.add('d-none'); if (init) init.classList.remove('d-none');
}

/** Binds priority buttons in the overlay and toggles the colors */
function bindOverlayPrio(){
  const root=document.getElementById('edit-task-content'); if(!root) return;
  const map=[['urgent','active-red'],['medium','active-yellow'],['low','active-green']];
  for (let i=0;i<map.length;i++){
    const btn=root.querySelector('#'+map[i][0]); if(!btn) continue;
    btn.type='button';
    btn.onclick=function(ev){
      ev.preventDefault();
      for(let j=0;j<map.length;j++){ const b=root.querySelector('#'+map[j][0]); if(b) b.classList.remove('active-red','active-yellow','active-green'); }
      this.classList.add(map[i][1]);
    };
  }
}
