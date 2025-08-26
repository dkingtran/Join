/**
 * Returns the HTML template for a subtask item with edit/delete actions.
 * @param {string} text - The subtask text content.
 * @param {string} id - The unique ID for the subtask (used in data-id).
 * @returns {string} HTML string for the subtask block.
 */

function getSubtaskTemplate(text, id) {
    return `
<div class="subtask-text-box flex justify-between" data-id="${id}">
    <div class="subtask-entry font-bundle" onclick="startEditSubtask(this)">•${text}</div>
    <div class="icon-edit-subtask-box display-standard d-none">
        <img class="icon-task edit-icon" src="assets/img/icons/add_task/Property1=edit.svg" alt="Edit Icon"
            onclick="startEditSubtask(this)">
        <svg width="2" height="24" viewBox="0 0 2 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.14453 0V24" stroke="#A8A8A8" />
        </svg>
        <img class="icon-task delete-subtask-input" src="assets/img/icons/add_task/delete.svg" alt="Cancel Icon"
            onclick="deleteSubtask(this)">
        <img class="icon-task confirm-icon d-none" src="assets/img/icons/add_task/check_noir.svg" alt="Confirm Icon"
            onclick="finishEditSubtask(this)">
    </div>
</div>
`;
}

/**
 * Returns the HTML template to switch a subtask div into an editable input.
 * @param {string} text - The current subtask text to prefill the input.
 * @returns {string} HTML string for an editable input field.
 */
function changeDivtoInputTemplate(text) {
return `
<input class="subtask-entry font-bundle border-bottom-blue" type="text" value="${text}"
    onkeydown="if(event.key==='Enter'){ finishEditSubtask(this); }">
`;
}

/**
 * Returns the HTML template to switch an editable subtask input back into a div.
 * @param {string} text - The final subtask text after editing.
 * @returns {string} HTML string for the subtask in read mode.
 */
function getReturnToDivTemplate(text) {
return `
<div class="subtask-entry font-bundle" onclick="startEditSubtask(this)">
    ${text}
</div>
`;
}

/**
 * Returns the HTML template for rendering a contact item in the assign dropdown.
 * @param {string} initials - The contact’s initials for the avatar.
 * @param {Object} name - The contact’s name object with first-name and last-name.
 * @param {string} color - The avatar background color (hex).
 * @returns {string} HTML string for the contact dropdown entry.
 */
function getAssignedNameTemplate(initials, name, color) {
return `
<div class="contact-item" onclick="toggleCheckboxContact(this)">
    <span class="avatar display-standard white-color " style="background-color: ${color};">${initials}</span>
    <span class="contact-name">${name["first-name"]} ${name["last-name"]}</span>
    <input type="checkbox" class="contact-checkbox" data-name="${name["first-name"]} ${name["last-name"]}"
        data-initials="${initials}" onclick="toggleCheckboxContact(this); event.stopPropagation();">
</div>
`;
}