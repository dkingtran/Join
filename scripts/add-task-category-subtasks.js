// =====================
// Category Dropdown (Select)
// =====================

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

function toggleSelectDropdown() {
    const select = document.getElementById('task-category');
    const arrow = document.getElementById('category-arrow');
    if (arrow.classList.contains('rotate')) {
        closeSelectDropdown(select, arrow);
    } else {
        openSelectDropdown(select, arrow);
    }
}

function openSelectDropdown(select, arrow) {
    select.focus();
    select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

function closeSelectDropdown(select, arrow) {
    select.blur();
    arrow.classList.remove('rotate');
}

// =====================
// Subtasks
// =====================
/**
 * Displays the active subtask input field by hiding the initial field.
 */
function showSubtaskInput() {
    initialBox.classList.add("d-none");
    activeBox.classList.remove("d-none");
}

/**
 * Resets the subtask input to its initial state.
 */
function cancelSubtaskInput() {
    activeBox.classList.add("d-none");
    initialBox.classList.remove("d-none");
    inputField.value = "";
}

/**
 * Generates subtask HTML, displays it in the output box,
 * @param {string} text - The subtask text to add
 */
function renderAndStoreSubtask(text) {
    const outputBox = document.getElementById("subtask-output");
    const subtaskHtml = getSubtaskTemplate(text);
    outputBox.innerHTML += subtaskHtml;
    subtask.push(text);
}

/**
 * Reads the current input value, trims whitespace, and returns it.
 * If the field is empty, shows an alert and returns null.
 * @returns {string|null}
 */
function getTrimmedSubtaskInput() {
    const inputField = document.getElementById("subtask-input-second");
    const inputText = inputField.value.trim();
    if (inputText === "") {
        alert("Please enter a subtask.");
        return null;
    }
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
    const subtaskDivs = document.querySelectorAll(".subtask-entry");
    const collected = {};
    for (let i = 0; i < subtaskDivs.length; i++) {
        const id = "subtask_" + Date.now() + "_" + i; // eindeutiger Key
        collected[id] = {
            subtask: subtaskDivs[i].innerText.trim(),
            done: false
        };
    }
    return collected;
}

/**
 * Deletes a specific subtask from the DOM and removes it from the subtask array.
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

// =====================
// Subtask Edit Mode
// =====================

/**
 * Activates edit mode for the clicked subtask.
 */
function startEditSubtask(element) {
    const { box, textElement, iconBox } = getSubtaskParts(element);
    const text = textElement.innerText;
    iconBox.querySelector(".edit-icon").classList.add("d-none");
    iconBox.querySelector(".confirm-icon").classList.remove("d-none");
    iconBox.classList.add("editing"); // Editing-Klasse hinzufügen
    textElement.outerHTML = changeDivtoInputTemplate(text);
}

/**
 * Finishes the subtask editing.
 */
function finishEditSubtask(iconElement) {
    const { box, iconBox } = getSubtaskParts(iconElement);
    const inputElement = box.querySelector("input.subtask-entry");
    const text = inputElement.value.trim();
    inputElement.outerHTML = getReturnToDivTemplate(text);
    iconBox.querySelector(".edit-icon")?.classList.remove("d-none");
    iconBox.querySelector(".confirm-icon")?.classList.add("d-none");
    iconBox.classList.remove("editing"); // Editing-Klasse entfernen
    box.querySelector(".delete-icon")?.classList.remove("d-none");
}

/**
 * Utility: Finds and returns relevant parts of a subtask block.
 */
function getSubtaskParts(element) {
    const box = element.closest(".subtask-text-box");
    const iconBox = box.querySelector(".icon-edit-subtask-box");
    const textElement = box.querySelector(".subtask-entry") || box.querySelector("input.subtask-entry");
    return { box, iconBox, textElement };
}
