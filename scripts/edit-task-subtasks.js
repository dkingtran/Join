function toggleDropdownOverlay(event) {
    event.stopPropagation();
    const overlay = document.getElementById('edit-task-content'); if (!overlay) return;
    const contactList = overlay.querySelector('#contactList');
    const dropdownArrow = overlay.querySelector('.assigned-to-container .arrow');
    const isVisible = contactList && contactList.style.display === 'block';
    if (contactList) contactList.style.display = isVisible ? 'none' : 'block';
    if (dropdownArrow) dropdownArrow.classList.toggle('rotate', !isVisible);
}

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

function renderSelectedAvatarsOverlay(selected, container) {
    container.innerHTML = "";
    const maxAvatars = 5;
    // Render visible avatars
    for (let i = 0; i < Math.min(selected.length, maxAvatars); i++) {
        const avatar = document.createElement("span");
        avatar.classList.add("avatar", "display-standard");
        avatar.style.backgroundColor = selected[i].color;
        avatar.textContent = selected[i].initials;
        container.appendChild(avatar);
    }
    // Render overflow if needed
    if (selected.length > maxAvatars) {
        const overflowCount = selected.length - maxAvatars;
        const overflowAvatar = document.createElement("span");
        overflowAvatar.classList.add("avatar", "display-standard");
        overflowAvatar.style.backgroundColor = "#2A3647";
        overflowAvatar.textContent = `+${overflowCount}`;
        container.appendChild(overflowAvatar);
    }
}

function updateAssignedListOverlay() {
    const overlay = document.getElementById('edit-task-content');
    if (!overlay) return;
    const container = overlay.querySelector('#selectedContacts');
    if (container) container.innerHTML = '';
    const contactCheckboxes = overlay.querySelectorAll('.contact-checkbox');
    const selected = [];
    for (let i = 0; i < contactCheckboxes.length; i++) {
        const checkbox = contactCheckboxes[i];
        if (checkbox.checked) {
            const name = checkbox.dataset.name;
            const initials = checkbox.dataset.initials;
            const color = checkbox.closest('.contact-item').querySelector('.avatar').style.backgroundColor;
            selected.push({ name, initials, color });
        }
    }
    renderSelectedAvatarsOverlay(selected, container);
}

function processContacts(assigned, contacts, selected) {
    for (let i = 0; i < contacts.length; i++) {
        const checkbox = contacts[i].querySelector('.contact-checkbox');
        const name = checkbox?.dataset?.name || contacts[i].querySelector('.contact-name')?.textContent.trim() || '';
        const active = assigned.includes(name);
        if (checkbox) { checkbox.checked = active; contacts[i].classList.toggle('active', active); }
        if (active && checkbox) {
            const initials = checkbox.dataset.initials;
            const color = contacts[i].querySelector('.avatar').style.backgroundColor;
            selected.push({ name, initials, color });
        }
    }
}

function addFakeContacts(assigned, selected) {
    for (let name of assigned) {
        if (!selected.some(s => s.name === name)) {
            const initials = getInitials(name);
            const color = '#B5C0D0';
            selected.push({ name, initials, color });
        }
    }
}

function prefillAssignedFromTaskOverlay(task) {
    const overlay = document.getElementById('edit-task-content');
    if (!overlay) return;
    const assigned = Array.isArray(task['assigned-to']) ? task['assigned-to'] : [];
    const contacts = overlay.querySelectorAll('.contact-item');
    const container = overlay.querySelector('#selectedContacts');
    if (container) container.innerHTML = '';
    const selected = [];
    processContacts(assigned, contacts, selected);
    addFakeContacts(assigned, selected);
    renderSelectedAvatarsOverlay(selected, container);
}

function collectAssigned(overlay) {
    const checked = [...overlay.querySelectorAll('.contact-checkbox:checked')].map(cb => cb.dataset.name);
    const originalAssigned = Array.isArray(window.currentEditingTask?.['assigned-to']) ? window.currentEditingTask['assigned-to'] : [];
    let assigned = checked.slice();
    for (let name of originalAssigned) {
        const fullName = name;
        if (!contacts.some(c => `${c.name['first-name']} ${c.name['last-name']}`.trim() === fullName) && !assigned.includes(fullName)) {
            assigned.push(fullName);
        }
    }
    return assigned;
}

function toggleSubtaskIcons(box) {
    const icons = box.querySelector('.icon-edit-subtask-box');
    if (!icons) return;
    icons.querySelector('.edit-icon')?.classList.add('d-none');
    icons.querySelector('.confirm-icon')?.classList.remove('d-none');
}

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

function deleteSubtaskOverlay(clickedElement) {
    const overlay = document.getElementById('edit-task-content');
    if (!overlay) return;
    const subtaskBox = clickedElement.closest('.subtask-text-box');
    if (!subtaskBox) return;
    subtaskBox.remove();
}

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

function collectSubtasksFromOverlay(overlay) {
    const out = {}, rows = overlay.querySelectorAll('#subtask-output .subtask-text-box'), ts = Date.now();
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i], id = row.dataset.subtaskId || `subtask_${ts}_${i}`;
        const text = (row.querySelector('.subtask-entry')?.textContent || '').replace(/^•\s*/, '').trim();
        const cb = row.querySelector('.subtask-checkbox');
        const done = cb ? cb.checked : row.dataset.done === 'true';
        row.dataset.subtaskId = id;
        row.dataset.done = String(done);
        out[id] = { subtask: text, done: done };
    }
    return out;
}

async function updateSubtasksFromOverlay(taskId) {
    const root = document.getElementById('edit-task-content'); if (!root) return;
    const payload = collectSubtasksFromOverlay(root);
    await putData(`/tasks/${taskId}/subtasks`, payload);
}

function prefillSubtasksFromTaskOverlay(task) {
    const out = document.querySelector('#edit-task-content #subtask-output');
    if (!out) return;
    out.innerHTML = '';

    Object.entries(task?.subtasks || {}).forEach(([id, { subtask = '', done = false }]) => {
        out.insertAdjacentHTML('beforeend', getSubtaskTemplateOverlay(subtask, id, done));
    });
}

function showSubtaskInputOverlay() {
    const overlay = document.getElementById('edit-task-content'); if (!overlay) return;
    const initialRow = overlay.querySelector('#subtask-initial');
    const activeRow = overlay.querySelector('#subtask-active');
    if (initialRow) initialRow.classList.add('d-none');
    if (activeRow) activeRow.classList.remove('d-none');
    const inputField = overlay.querySelector('#subtask-input-second');
    if (inputField) inputField.focus();
}

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

function getPriorityButtons(overlay) {
    return {
        urgent: overlay.querySelector('#urgent'),
        medium: overlay.querySelector('#medium'),
        low: overlay.querySelector('#low')
    };
}

function bindPriorityButtons(buttons) {
    function reset() {
        [buttons.urgent, buttons.medium, buttons.low].forEach(btn =>
            btn?.classList.remove('active-red', 'active-yellow', 'active-green'));
    }
    buttons.urgent.onclick = e => { e.preventDefault(); reset(); buttons.urgent.classList.add('active-red'); };
    buttons.medium.onclick = e => { e.preventDefault(); reset(); buttons.medium.classList.add('active-yellow'); };
    buttons.low.onclick = e => { e.preventDefault(); reset(); buttons.low.classList.add('active-green'); };
}

function bindOverlayPrio() {
    const overlay = document.getElementById('edit-task-content');
    if (!overlay) return;
    const buttons = getPriorityButtons(overlay);
    bindPriorityButtons(buttons);
}

window.startEditSubtaskOverlay = startEditSubtaskOverlay;
window.deleteSubtaskOverlay = deleteSubtaskOverlay;
window.finishEditSubtaskOverlay = finishEditSubtaskOverlay;