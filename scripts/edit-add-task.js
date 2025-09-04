/** Opens the overlay and disables body scroll */
function openEditCard() {
  const overlay = document.getElementById("edit-task-overlay");
  overlay.classList.remove("d-none");
  document.body.classList.add("no-scroll");
  overlay.onclick = function (event) {
    if (event.target === overlay) closeEditCard();
  };
}

function getOverlayRoot() {
  return document.getElementById('edit-task-content');
}


/**
 * Toggles the visibility of the contact dropdown inside the edit-task overlay.
 * Also rotates the dropdown arrow to indicate state.
 * @param {Event} event - The click event that triggered the toggle.
 */
function toggleDropdownOverlay(event) {
  event.stopPropagation();
  const overlay = document.getElementById('edit-task-content'); if (!overlay) return;
  const contactList = overlay.querySelector('#contactList');
  const dropdownArrow = overlay.querySelector('.assigned-to-container .arrow');
  const isVisible = contactList && contactList.style.display === 'block';
  if (contactList) contactList.style.display = isVisible ? 'none' : 'block';
  if (dropdownArrow) dropdownArrow.classList.toggle('rotate', !isVisible);
}

/**
 * Handles clicks inside the overlay to close the contact dropdown
 * when the user clicks outside of the dropdown input or contact items.
 * @param {Event} event - The click event within the overlay. 
 */
function handleDropdownClickOverlay(event) {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const clickedInput = event.target.closest('.dropdown-input');
  const clickedContact = event.target.closest('.contact-item');
  if (!clickedInput && !clickedContact) {
    const contactList = overlay.querySelector('#contactList');
    const dropdownArrow = overlay.querySelector('.assigned-to-container .arrow');
    if (contactList) contactList.style.display = 'none';
    if (dropdownArrow) dropdownArrow.classList.remove('rotate');
  }
}

/**
 * Toggles a contact checkbox and its active state in the overlay.
 * @param {HTMLElement} clickedElement - Clicked element (checkbox or contact item).
 */
function toggleCheckboxContactOverlay(clickedElement) {
  const contactItem = clickedElement.classList.contains('contact-checkbox')
    ? clickedElement.closest('.contact-item')
    : clickedElement;
  const checkbox = contactItem.querySelector('.contact-checkbox');
  if (!clickedElement.classList.contains('contact-checkbox')) {
    checkbox.checked = !checkbox.checked;
  }
  contactItem.classList.toggle('active', checkbox.checked);
  updateAssignedListOverlay();
}

/** Rebuild selected avatars + assignedTo (overlay-scoped) */
function updateAssignedListOverlay() {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const selectedContactsContainer = overlay.querySelector('#selectedContacts');
  if (selectedContactsContainer) selectedContactsContainer.innerHTML = '';
  const contactCheckboxes = overlay.querySelectorAll('.contact-checkbox');
  const selectedNames = [];
  for (let i = 0; i < contactCheckboxes.length; i++) {
    const checkbox = contactCheckboxes[i];
    if (checkbox.checked) {
      selectedNames.push(checkbox.dataset.name);
      const avatar = checkbox.closest('.contact-item').querySelector('.avatar');
      addAvatarToContainer(selectedContactsContainer, avatar, checkbox.dataset.initials);
    }
  }
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

/** Appends a styled avatar with initials to the given container. */
function addAvatarToContainer(container, avatar, initials) {
  const avatarElement = document.createElement('span');
  avatarElement.className = 'avatar display-standard';
  avatarElement.style.backgroundColor = avatar ? avatar.style.backgroundColor : '#2A3647';
  avatarElement.textContent = initials || '';
  container.appendChild(avatarElement);
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
function startEditSubtaskOverlay(clickedElement) {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const subtaskBox = clickedElement.closest('.subtask-text-box');
  if (!subtaskBox) return;
  const textElement = subtaskBox.querySelector('.subtask-entry');
  const currentText = (textElement?.textContent || '').replace(/^•\s*/, '').trim();
  toggleSubtaskIcons(subtaskBox);
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.className = 'subtask-entry font-bundle border-bottom-blue';
  inputField.value = currentText;
  inputField.onkeydown = e => { if (e.key === 'Enter') finishEditSubtaskOverlay(inputField); };
  if (textElement) textElement.replaceWith(inputField);
}

/** Deletes one subtask row inside the EDIT overlay */
function deleteSubtaskOverlay(clickedElement) {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const subtaskBox = clickedElement.closest('.subtask-text-box');
  if (!subtaskBox) return;
  subtaskBox.remove(); // entfernt die Subtask-Zeile aus der UI
}

/** Finishes subtask edit in the overlay: replaces input with text and resets icons.  
 * @param {HTMLElement} el - The edited input element or a child inside the subtask row. */
function finishEditSubtaskOverlay(clickedElement) {
  const overlay = document.getElementById('edit-task-content'); if (!overlay) return;
  const subtaskBox = clickedElement.closest('.subtask-text-box'); if (!subtaskBox) return;
  const inputField = (clickedElement.tagName === 'INPUT' ? clickedElement : subtaskBox.querySelector('input.subtask-entry')); if (!inputField) return;
  const newText = (inputField.value || '').trim();
  const textDiv = document.createElement('div');
  textDiv.className = 'subtask-entry font-bundle';
  textDiv.textContent = '•' + newText;
  textDiv.onclick = function () { startEditSubtaskOverlay(this); };
  inputField.replaceWith(textDiv);
  const iconBox = subtaskBox.querySelector('.icon-edit-subtask-box');
  if (iconBox) { iconBox.querySelector('.edit-icon')?.classList.remove('d-none'); iconBox.querySelector('.confirm-icon')?.classList.add('d-none'); }
}

/** Collects subtasks from the edit overlay into an object keyed by timestamp+index. */
function collectSubtasksFromOverlay(overlay) {
  const subtasks = {};
  const subtaskEntries = overlay.querySelectorAll('#subtask-output .subtask-entry');
  for (let i = 0; i < subtaskEntries.length; i++) {
    const entryText = (subtaskEntries[i].textContent || '').replace(/^•\s*/, '').trim();
    const subtaskId = 'subtask_' + Date.now() + '_' + i;
    subtasks[subtaskId] = { subtask: entryText, done: false };
  }
  return subtasks;
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
  const task = displayedTasks[taskId];
  if (!task) return;
  openEditCard();
  showEditTaskBig();
  prefillEditForm(task);
  bindOverlayPrio();
  await loadContactsIntoDropdownOverlay();
  prefillAssignedFromTaskOverlay(task);
  prefillSubtasksFromTaskOverlay(task);
  bindEditOverlayButton(task.id);
}

/** Prefills the edit overlay form with the task's title, description, and due date. */
function prefillEditFormFields(root, task) {
  const titleInput = root.querySelector('#title-task');
  if (titleInput) titleInput.value = task.title || '';
  const descInput = root.querySelector('#task-description');
  if (descInput) descInput.value = task.description || '';
  const due = task['due-date'] || task.due || task.date || '';
  const dateInput = root.querySelector('#task-date');
  if (dateInput) dateInput.value = due ? String(due).slice(0, 10) : '';
}

/** Resets and applies the correct active style to the priority button in the edit overlay. */
function prefillEditFormPriority(root, task) {
  const ids = ['urgent', 'medium', 'low'];
  for (let i = 0; i < ids.length; i++) {
    const btn = root.querySelector('#' + ids[i]);
    if (btn) btn.classList.remove('active-red', 'active-yellow', 'active-green');}
  const pr = (task.priority || '').toLowerCase();
  if (pr === 'urgent') root.querySelector('#urgent')?.classList.add('active-red');
  if (pr === 'medium') root.querySelector('#medium')?.classList.add('active-yellow');
  if (pr === 'low') root.querySelector('#low')?.classList.add('active-green');
}

/** Wrapper that fills all edit form fields (title, description, date, priority) in the overlay. */
function prefillEditForm(task) {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  prefillEditFormFields(overlay, task);
  prefillEditFormPriority(overlay, task);
}

/** Prefills assigned contacts in the overlay by checking boxes and rendering avatars.  
 * @param {Object} task - Task object with an `assigned-to` array of contact names. */
function prefillAssignedFromTaskOverlay(task) {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const assigned = Array.isArray(task['assigned-to']) ? task['assigned-to'] : [];
  const contacts = overlay.querySelectorAll('.contact-item');
  const container = overlay.querySelector('#selectedContacts');
  if (container) container.innerHTML = '';
  for (let i = 0; i < contacts.length; i++) {
    const checkbox = contacts[i].querySelector('.contact-checkbox');
    const name = checkbox?.dataset?.name || contacts[i].querySelector('.contact-name')?.textContent.trim() || '';
    const active = assigned.includes(name);
    if (checkbox) { checkbox.checked = active; contacts[i].classList.toggle('active', active); }
    if (active && container) addAvatarToContainer(container, contacts[i].querySelector('.avatar'), checkbox?.dataset?.initials);
  }
}

/** Collects all form values from the edit overlay (title, description, due date, priority, assigned).  
 * @returns {Object} Form data object with title, description, due-date, priority, and assigned-to array. */
function collectEditFormData(overlay = getOverlayRoot()) {
  if (!overlay) return { title:'', description:'', "due-date":'', priority:'', "assigned-to":[] };
  const titleValue = overlay.querySelector('#title-task')?.value.trim() || '';
  const descriptionValue = overlay.querySelector('#task-description')?.value.trim() || '';
  const dueDateValue = overlay.querySelector('#task-date')?.value || '';
  let priorityValue = ''; const priorityIds = ['urgent','medium','low'];
  for (let i = 0; i < priorityIds.length; i++) {
    const btn = overlay.querySelector('#' + priorityIds[i]);
    if (btn?.classList.contains('active-red')) priorityValue = 'urgent';
    else if (btn?.classList.contains('active-yellow')) priorityValue = 'medium';
    else if (btn?.classList.contains('active-green')) priorityValue = 'low';
  }
  const assignedNames = [];
  const contactCheckboxes = overlay.querySelectorAll('.contact-checkbox');
  for (let i = 0; i < contactCheckboxes.length; i++)
    if (contactCheckboxes[i].checked) assignedNames.push(contactCheckboxes[i].dataset.name);
  return { title: titleValue, description: descriptionValue, "due-date": dueDateValue, priority: priorityValue, "assigned-to": assignedNames };
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
  const overlay = getOverlayRoot();
  const formElement = overlay?.querySelector('#form-element');
  if (!formElement) return;
  formElement.onsubmit = async e => {
    e.preventDefault();
    const formData = collectEditFormData();
    const subtasksPayload = collectSubtasksFromOverlay(overlay);
    const fields = ['title','description','due-date','priority','assigned-to'];
    await Promise.all(fields.map(n => putData(`/tasks/${taskId}/${n}`, formData[n])));
    await putData(`/tasks/${taskId}/subtasks`, subtasksPayload);
    closeEditCard();
    updateTaskCache(taskId, { ...formData, subtasks: subtasksPayload });
    renderBigCard(taskId, displayedTasks[taskId]);
  };
}

/** Renders the task's existing subtasks into the edit overlay list.  
 * @param {Object} task - Task object containing a `subtasks` map. */
function prefillSubtasksFromTaskOverlay(task) {
  const overlay = document.getElementById('edit-task-content');
  const subtaskOutput = overlay?.querySelector('#subtask-output');
  if (!subtaskOutput) return;
  subtaskOutput.innerHTML = '';
  const subtasks = task?.subtasks || {};
  const subtaskIds = Object.keys(subtasks);
  for (let i = 0; i < subtaskIds.length; i++) {
    const subtaskData = subtasks[subtaskIds[i]];
    const subtaskText = subtaskData?.subtask || '';
    subtaskOutput.insertAdjacentHTML('beforeend', getSubtaskTemplateOverlay(subtaskText));
  }
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

/** Binds priority buttons in the overlay and toggles the colors */
function updateOverlayPrioIcon(root, isActive) {
  if (!root) return;
  setMediumIcon(isActive, root);
}

/** Binds priority buttons in the edit overlay and updates the medium icon */
function bindOverlayPrio() {
  const overlay = document.getElementById('edit-task-content');
  if (!overlay) return;
  const urgent = overlay.querySelector('#urgent');
  const medium = overlay.querySelector('#medium');
  const low = overlay.querySelector('#low');

  /** Removes all active priority classes from the overlay buttons */

  function reset() {
    [urgent, medium, low].forEach(btn =>
      btn?.classList.remove('active-red', 'active-yellow', 'active-green'));
  }

  urgent.onclick = e => { e.preventDefault(); reset(); urgent.classList.add('active-red'); updateOverlayPrioIcon(overlay, false); };
  medium.onclick = e => { e.preventDefault(); reset(); medium.classList.add('active-yellow'); updateOverlayPrioIcon(overlay, true); };
  low.onclick = e => { e.preventDefault(); reset(); low.classList.add('active-green'); updateOverlayPrioIcon(overlay, false); };
}

window.startEditSubtaskOverlay = startEditSubtaskOverlay;
window.deleteSubtaskOverlay = deleteSubtaskOverlay;
window.finishEditSubtaskOverlay = finishEditSubtaskOverlay;
window.openEditCardFor = openEditCardFor;