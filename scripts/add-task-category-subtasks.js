/**
 * Sets up event listeners for the category dropdown.
 */
function setupCategoryDropdown() {
    const select = document.getElementById('task-category');
    const arrow = document.getElementById('category-arrow');
    if (!select || !arrow) return;
    select.addEventListener('mousedown', () => {
        if (arrow.classList.contains('rotate')) {
            setTimeout(() => closeSelectDropdown(select, arrow), 0);
        }
    });
    select.addEventListener('focus', () => arrow.classList.add('rotate'));
    select.addEventListener('blur', () => arrow.classList.remove('rotate'));
}

/**
 * Toggles the visibility of the category dropdown.
 */
function toggleSelectDropdown() {
    const select = document.getElementById('task-category');
    const arrow = document.getElementById('category-arrow');
    if (arrow.classList.contains('rotate')) {
        closeSelectDropdown(select, arrow);
    } else {
        openSelectDropdown(select, arrow);
    }
}

/**
 * Opens the category dropdown by focusing the select element.
 * @param {HTMLElement} select - The select element.
 * @param {HTMLElement} arrow - The arrow element.
 */
function openSelectDropdown(select, arrow) {
    select.focus();
    select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

/**
 * Closes the category dropdown by blurring the select element.
 * @param {HTMLElement} select - The select element.
 * @param {HTMLElement} arrow - The arrow element.
 */
function closeSelectDropdown(select, arrow) {
    select.blur();
    arrow.classList.remove('rotate');
}

/**
 * Displays the active subtask input field by hiding the initial field.
 */
function showSubtaskInput() {
    const initialBox = document.getElementById("subtask-initial");
    const activeBox = document.getElementById("subtask-active");

    if (!initialBox || !activeBox) return console.warn("Subtask boxes not found");
    initialBox.classList.add("d-none");
    activeBox.classList.remove("d-none");
    const input = document.getElementById("subtask-input-second");
    if (input) {
        input.focus();
    }
}

/**
 * Resets the subtask input to its initial state.
 */
function cancelSubtaskInput() {
    if (activeBox) activeBox.classList.add("d-none");
    if (initialBox) initialBox.classList.remove("d-none");

    if (inputField) {
        inputField.value = "";
        inputField.classList.remove("border-red");
    }

    const error = document.getElementById("subtask-error");
    if (error) error.classList.add("d-none");
}

/**
 * Generates subtask HTML, displays it in the output box, and stores the subtask.
 * @param {string} text - The subtask text to add.
 */
function renderAndStoreSubtask(text) {
    const outputBox = document.getElementById("subtask-output");
    const subtaskHtml = getSubtaskTemplate(text);
    outputBox.innerHTML += subtaskHtml;
    subtask.push(text);
}

/**
 * Reads the current input value, trims whitespace, and returns it.
 * If the field is empty, shows an error and returns null.
 * @returns {string|null} The trimmed input text or null if invalid.
 */
function getTrimmedSubtaskInput() {
    const inputField = document.getElementById("subtask-input-second");
    const inputText = inputField.value.trim();
    if (inputText === "") {
        inputField.classList.add("border-red");
        const error = document.getElementById("subtask-error");
        if (error) error.classList.remove("d-none");
        return null;
    }
    inputField.classList.remove("border-red");
    const error = document.getElementById("subtask-error");
    if (error) error.classList.add("d-none");
    return inputText;
}

/**
 * Handles the subtask confirmation process:
 * validates input, updates UI, and resets the input.
 */
function confirmSubtaskInput() {
    const inputText = getTrimmedSubtaskInput();
    if (!inputText) return;
    renderAndStoreSubtask(inputText);
    document.getElementById("subtask-input-second").value = "";
    cancelSubtaskInput();
}

/**
 * Collects all current subtasks from the DOM.
 */
function collectSubtasksFromDOM() {
    const container = document.getElementById('subtask-output');
    if (!container) return {};
    const nodes = container.querySelectorAll('.subtask-entry');
    const collected = {};
    let seq = 0;
    const ts = Date.now();
    for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        const raw = (el.value !== undefined ? el.value : el.textContent).trim();
        if (!raw) continue;
        const text = raw.replace(/^•\s*/, '');
        const id = el.dataset.subtaskId || `subtask_${ts}_${seq++}`;
        collected[id] = { subtask: text, done: false };
    }
    return collected;
}

/**
 * Deletes a specific subtask from the DOM and removes it from the subtask array.
 * @param {HTMLElement} element - The element triggering the delete action.
 */
function deleteSubtask(element) {
    const subtaskBox = element.closest(".subtask-text-box");
    if (!subtaskBox) return;
    const textElement = subtaskBox.querySelector(".subtask-entry");
    const text = textElement?.innerText?.trim();
    subtaskBox.remove();
    const index = subtask.indexOf(text);
    if (index !== -1) {
        subtask.splice(index, 1);
    }
}

/**
 * Activates edit mode for the clicked subtask.
 * @param {HTMLElement} element - The element triggering the edit action.
 */
function startEditSubtask(element) {
    const { box, textElement, iconBox } = getSubtaskParts(element);
    const text = textElement.innerText;
    iconBox.querySelector(".edit-icon").classList.add("d-none");
    iconBox.querySelector(".confirm-icon").classList.remove("d-none");
    iconBox.classList.add("editing");
    textElement.outerHTML = changeDivtoInputTemplate(text);
}

/**
 * Finishes the subtask editing.
 * @param {HTMLElement} iconElement - The icon element triggering the finish action.
 */
function finishEditSubtask(iconElement) {
    const { box, iconBox } = getSubtaskParts(iconElement);
    const inputElement = box.querySelector("input.subtask-entry");
    const text = inputElement.value.trim();
    const errorElement = box.querySelector(".subtask-error-msg");
    if (text === "") {
        inputElement.classList.add("border-red");
        if (errorElement) errorElement.classList.remove("d-none");
        inputElement.focus();
        return;
    }
    inputElement.classList.remove("border-red");
    if (errorElement) errorElement.classList.add("d-none");
    inputElement.outerHTML = getReturnToDivTemplate(text);
    iconBox.querySelector(".edit-icon")?.classList.remove("d-none");
    iconBox.querySelector(".confirm-icon")?.classList.add("d-none");
    iconBox.classList.remove("editing");
    box.querySelector(".delete-icon")?.classList.remove("d-none");
}

/**
 * Utility: Finds and returns relevant parts of a subtask block.
 * @param {HTMLElement} element - The element within the subtask block.
 * @returns {Object} An object containing box, iconBox, and textElement.
 */
function getSubtaskParts(element) {
    const box = element.closest(".subtask-text-box");
    const iconBox = box.querySelector(".icon-edit-subtask-box");
    const textElement = box.querySelector(".subtask-entry") || box.querySelector("input.subtask-entry");
    return { box, iconBox, textElement };
}
