/** Opens the overlay and disables body scroll */
function openEditCard() {
  const overlay = document.getElementById("edit-task-overlay");
  overlay.classList.remove("d-none");
  document.body.classList.add("no-scroll");
  overlay.onclick = function (event) {
    if (event.target === overlay) closeEditCard();
  };
}

//=============
/** Toggle dropdown inside overlay */
function toggleDropdownOverlay(event) {
  event.stopPropagation();
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const list = root.querySelector('#contactList'); const arrow = root.querySelector('.assigned-to-container .arrow');
  const vis = list && list.style.display === 'block';
  if (list) list.style.display = vis ? 'none' : 'block';
  if (arrow) arrow.classList.toggle('rotate', !vis);
}

/** Close dropdown when clicking outside (overlay-scoped) */
function handleDropdownClickOverlay(event) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const input = event.target.closest('.dropdown-input'); const item = event.target.closest('.contact-item');
  if (!input && !item) {
    const list = root.querySelector('#contactList'); const arrow = root.querySelector('.assigned-to-container .arrow');
    if (list) list.style.display = 'none'; if (arrow) arrow.classList.remove('rotate');
  }
}

/** Checkbox toggle inside overlay */
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



/** Overlay version of contact item template (calls overlay handlers) */
function getAssignedNameTemplateOverlay(initials, name, color) {
  return `<div class="contact-item" onclick="toggleCheckboxContactOverlay(this)">
    <span class="avatar display-standard white-color" style="background-color:${color};">${initials}</span>
    <span class="contact-name">${name["first-name"]} ${name["last-name"]}</span>
    <input type="checkbox" class="contact-checkbox"
      data-name="${name["first-name"]} ${name["last-name"]}" data-initials="${initials}"
      onclick="toggleCheckboxContactOverlay(this); event.stopPropagation();">
  </div>`;
}

//==========
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
/** Switches one subtask row in the EDIT overlay into input mode */
function startEditSubtaskOverlay(el) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const box = el.closest('.subtask-text-box'); if (!box) return;
  const txtEl = box.querySelector('.subtask-entry');
  const txt = (txtEl?.textContent || '').replace(/^•\s*/, '').trim();
  const icons = box.querySelector('.icon-edit-subtask-box');
  if (icons) {
    icons.querySelector('.edit-icon')?.classList.add('d-none');
    icons.querySelector('.confirm-icon')?.classList.remove('d-none');
  }
  const input = document.createElement('input');
  input.type = 'text'; input.className = 'subtask-entry font-bundle border-bottom-blue'; input.value = txt;
  input.onkeydown = function (e) { if (e.key === 'Enter') { finishEditSubtaskOverlay(this); } };
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

/** Confirms edit: replace input with text and reset icons (EDIT overlay) */
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

/** Collects all subtasks from the EDIT overlay into an object */
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

/** Writes the EDIT overlay subtasks to Firebase */
async function updateSubtasksFromOverlay(taskId) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const payload = collectSubtasksFromOverlay(root); // nutzt deine Overlay-Collector-Funktion
  await putData(`/tasks/${taskId}/subtasks`, payload);
}


/** Opens overlay, renders edit form, loads contacts, then pre-fills */
async function openEditCardFor(taskId) {
  const task = findTaskById(taskId); if (!task) return;
  openEditCard();                 // Overlay zeigen
  showEditTaskBig();              // Template in Overlay
  prefillEditForm(task);      
  bindOverlayPrio();     // Title/Desc/Date/Prio
  await loadContactsIntoDropdownOverlay(); // Kontakte ins Overlay
  prefillAssignedFromTaskOverlay(task);    // Assigned (Checkboxen + Avatare)
  prefillSubtasksFromTaskOverlay(task);
  attachEditFormSubmit(task.id); // <— hier hinzufügen
  bindEditOverlayButton(task.id);
}

window.openEditCardFor = openEditCardFor;

//By Chat GPT
/** Prefills the edit form inside #edit-task-content (no category) */
function prefillEditForm(task) {
  var root = document.getElementById('edit-task-content'); if (!root) return;
  var t = root.querySelector('#title-task'); if (t) t.value = task.title || '';
  var dsc = root.querySelector('#task-description'); if (dsc) dsc.value = task.description || '';
  var d = task["due-date"] || task.due || task.date || ''; var di = root.querySelector('#task-date');
  if (di) di.value = d ? String(d).slice(0, 10) : '';
  var ids = ['urgent', 'medium', 'low'];
  for (var i = 0; i < ids.length; i++) { var el = root.querySelector('#' + ids[i]); if (el) { el.classList.remove('active-red', 'active-yellow', 'active-green'); } }
  var p = (task.priority || '').toLowerCase();
  if (p === 'urgent') root.querySelector('#urgent')?.classList.add('active-red');
  if (p === 'medium') root.querySelector('#medium')?.classList.add('active-yellow');
  if (p === 'low') root.querySelector('#low')?.classList.add('active-green');
}


/** Prefills assigned contacts inside the overlay (checkboxes + avatars) */
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


/** Waits until .contact-item exists in overlay, then pre-fills assigned */
function waitAndPrefillAssigned(task) {
  const root = document.getElementById('edit-task-content'); let t = 0;
  const h = setInterval(function () {
    t++;
    const items = root ? root.querySelectorAll('.contact-item') : null;
    if (items && items.length) { clearInterval(h); prefillAssignedFromTask(task); }
    if (t > 50) { clearInterval(h); } // Timeout ~5s
  }, 100);
}

/** Wires the edit form submit to update Firebase (field-wise) */
function attachEditFormSubmit(taskId) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const form = root.querySelector('#form-element'); if (!form) return;
  form.onsubmit = async function (e) {
    e.preventDefault();
    const d = collectEditFormData(root);
    await putData(`/tasks/${taskId}/title`, d.title);
    await putData(`/tasks/${taskId}/description`, d.description);
    await putData(`/tasks/${taskId}/due-date`, d["due-date"]);
    await putData(`/tasks/${taskId}/priority`, d.priority);
    await putData(`/tasks/${taskId}/assigned-to`, d["assigned-to"]);
    closeEditCard(); if (typeof init === 'function') await init();
  };
}

/** Collects title/desc/date/priority/assigned from the overlay */
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

/** Binds the overlay OK button to the overlay form (scoped) */
function bindEditOverlayButton(taskId) {
  const root = document.getElementById('edit-task-content'); if (!root) return;
  const form = root.querySelector('#form-element'); if (!form) return;
  const btn = root.querySelector('.edit-add-task-button-container button'); if (!btn) return;
  btn.onclick = function (e) { e.preventDefault(); form.requestSubmit(); };
  bindEditOverlayFormSubmit(taskId); // Teil B (Submit-Handler) folgt
}

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

/** Renders existing subtasks of the task into the EDIT overlay list */
function prefillSubtasksFromTaskOverlay(task) {
  var root = document.getElementById('edit-task-content'); if (!root) return;
  var out = root.querySelector('#subtask-output'); if (!out) return; out.innerHTML = '';
  var subs = (task && task.subtasks) ? task.subtasks : {}; var ids = Object.keys(subs);
  for (var i = 0; i < ids.length; i++) {
    var e = subs[ids[i]]; var txt = (e && e.subtask) || '';
    out.insertAdjacentHTML('beforeend', getSubtaskTemplateOverlay(txt));
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


/** Bindet Prio-Buttons im Overlay und toggelt die Farben */
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
