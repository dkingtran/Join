let selectedPriority = "";
let subtask = [];
let assignedTo = [];

/**
 * Retrieves all form data for a task and returns it as an object.
 * @returns {Object} Task data object
 */
function getTaskData() {
    const $ = id => document.getElementById(id).value.trim();
    return {
        title: $('title-task'),
        description: $('task-description'),
        "due-date": document.getElementById('task-date').value,
        priority: selectedPriority,
        "assigned-to": assignedTo,
        category: $('task-category'),
        subtasks: collectSubtasksFromDOM(),
        status: { done: false, feedback: false, "in-progress": false, "to-do": true }
    };
}

function validateTitleInput() {
    const titleInput = document.getElementById('title-task');
    const titleError = document.querySelector('#title-error-border .error-text');
    const isValid = titleCheck(titleInput.value);
    titleInput.classList.toggle("border-red", !isValid);
    titleError.classList.toggle("d-none", isValid);
    return isValid;
}

function validateDateInput() {
    const dateInput = document.getElementById('task-date');
    const dateError = document.querySelector('#date-error-border .error-text');
    const isValid = dateCheck(dateInput.value);
    dateInput.classList.toggle("border-red", !isValid);
    dateError.classList.toggle("d-none", isValid);
    return isValid;
}

function checkTitleDateInput() {
    const titleOk = validateTitleInput();
    const dateOk = validateDateInput();
    return titleOk && dateOk;
}

// Assigned
/**
 * Toggles the visibility of the dropdown list when clicked.
 * @param {Event} event - The click event triggering the dropdown toggle.
 */
function toggleDropdown(event) {
    event.stopPropagation(); // Prevents outer click handler from interfering
    const list = document.getElementById("contactList");
    const arrow = document.querySelector(".arrow");
    const visible = list.style.display === "block";
    list.style.display = visible ? "none" : "block";
    arrow.classList.toggle("rotate", !visible);
}

/**
 * Handles clicks outside the dropdown input or contact list items.
 * @param {Event} event - The click event on the document.
 */
function handleDropdownClick(event) {
    const clickedInsideInput = event.target.closest(".dropdown-input");
    const clickedContactItem = event.target.closest(".contact-item");
    checkClickOutside(clickedInsideInput, clickedContactItem);
}

/**
 * Closes the contact dropdown if the user clicked outside both
 * @param {HTMLElement|null} clickedInsideInput - Element if the input field was clicked, otherwise null
 * @param {HTMLElement|null} clickedContactItem - Element if a contact item was clicked, otherwise null
 */
function checkClickOutside(clickedInsideInput, clickedContactItem) {
    if (!clickedInsideInput && !clickedContactItem) {
        document.getElementById("contactList").style.display = "none";
        document.querySelector(".arrow").classList.remove("rotate");
    }
}

/**
 * Toggles the "rotate" class on the category dropdown arrow
 * @param {boolean} rotate - If true, adds the "rotate" class; if false, removes it.
 */
function rotateCategoryArrow(rotate) {
    const arrow = document.getElementById("category-arrow");
    if (arrow) {
        arrow.classList.toggle("rotate", rotate);
    }
}

/**
 * Toggles the state of a checkbox within a container.
 * @param {HTMLElement} container The HTML element container that holds the checkbox.
 */
function toggleCheckboxContact(containerOrCheckbox) {
    const isCheckbox = containerOrCheckbox.classList.contains("contact-checkbox");
    const container = isCheckbox
        ? containerOrCheckbox.closest(".contact-item")// Ternary Operator
        : containerOrCheckbox;
    const checkbox = container.querySelector(".contact-checkbox");
    if (!isCheckbox) {
        checkbox.checked = !checkbox.checked;
    }
    if (checkbox.checked) {
        container.classList.add("active");
    } else {
        container.classList.remove("active");
    }
    updateAssignedList();
}

/**
 * Adds a change listener to each contact checkbox.
 */
function setupCheckboxListener() {
    const checkboxes = document.querySelectorAll(".contact-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        checkbox.addEventListener("change", updateAssignedList);
    }
}

/**
 * Checks all currently selected (checked) fields,
 * updates the input field, and stores all selected values.
 */
function createAvatar(initials, color) {
    const avatar = document.createElement("span");
    avatar.classList.add("avatar", "display-standard");
    avatar.style.backgroundColor = color;
    avatar.textContent = initials;
    return avatar;
}

function processCheckedContact(checkbox, selected, selectedContainer) {
    const name = checkbox.dataset.name;
    const initials = checkbox.dataset.initials;
    const color = checkbox.closest(".contact-item")
        .querySelector(".avatar").style.backgroundColor;
    selected.push(name);
    const avatar = createAvatar(initials, color);
    selectedContainer.appendChild(avatar);
}

function updateAssignedList() {
    const checkboxes = document.querySelectorAll(".contact-checkbox");
    const selectedContainer = document.getElementById("selectedContacts");
    const selected = [];
    selectedContainer.innerHTML = "";
    for (let j = 0; j < checkboxes.length; j++) {
        const checkbox = checkboxes[j];
        if (checkbox.checked) {
            processCheckedContact(checkbox, selected, selectedContainer);
        }
    }
    assignedTo = selected;
}

/** 
 * Loads all contacts from Firebase and displays them in the dropdown menu.
 */
async function loadContactsIntoDropdown() {
    const data = await loadData("contacts");
    const list = document.getElementById("contactList");
    list.innerHTML = "";
    const contacts = Object.values(data);
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const prepared = prepareContactData(contact);
        renderContactToDropdown(prepared, list);
        console.log(prepared);
    }
    setupCheckboxListener();
}

function prepareContactData(contact) {
    const name = contact.name;
    const initials = name["first-name"][0] + name["last-name"][0];
    const colorClass = contact.color || "bg-cccccc";
    const hexColor = "#" + colorClass.replace("bg-", "");

    return { initials, name, hexColor };
}

function renderContactToDropdown({ initials, name, hexColor }, container) {
    container.innerHTML += getAssignedNameTemplate(initials, name, hexColor);
}

const initialBox = document.getElementById("subtask-initial");
const activeBox = document.getElementById("subtask-active");
const inputField = document.getElementById("subtask-input-second");

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

/**
 * Form submission event listener with validation and data posting.
 */
document.getElementById("form-element").addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!checkTitleDateInput()) return;
    const taskData = getTaskData();
    await postData("tasks", taskData);
    if (checkTitleDateInput()) {
        showSuccessMessage();
    }
    resetFormState();
});

/**
 * Closes the contact dropdown when the user clicks outside of it.
 */
document.addEventListener("click", function (event) {
    const dropdown = document.querySelector(".custom-dropdown");
    const list = document.getElementById("contactList");
    if (!dropdown.contains(event.target)) {
        list.style.display = "none"; // Dropdown schließen
        document.querySelector(".arrow").classList.remove("rotate");
    }
});

function resetFormState() {
    document.getElementById("form-element").reset();
    document.getElementById("subtask-output").innerHTML = "";
    document.getElementById("selectedContacts").innerHTML = "";
    subtask = [];
    document.querySelectorAll(".error-text").forEach(el => el.classList.add("d-none"));
    document.querySelectorAll(".border-red").forEach(el => el.classList.remove("border-red"));
    document.querySelectorAll(".contact-item.active").forEach(el => el.classList.remove("active"));
    resetButtons();
    cancelSubtaskInput();
}

function showSuccessMessage() {
    const messageBox = document.getElementById('task-message');
    messageBox.classList.remove('hidden');
    setTimeout(() => {
        messageBox.classList.add('show');
    }, 10);
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
    setTimeout(() => {
        messageBox.classList.add('hidden');
        window.location.href = "board.html"; // 🔁 Zielseite hier eintragen
    }, 1500);
}

/**
 * Closes the contact dropdown when the user clicks outside of it.
 */
document.addEventListener("DOMContentLoaded", () => {
    setupCheckboxListener();
    loadContactsIntoDropdown();

    // Select-Arrow und Dropdown-Logik
    const categorySelect = document.getElementById('task-category');
    const categoryArrow = document.getElementById('category-arrow');
    
    if (categorySelect && categoryArrow) {
        categorySelect.addEventListener('mousedown', () => {
            if (categoryArrow.classList.contains('rotate')) {
                setTimeout(() => closeSelectDropdown(categorySelect, categoryArrow), 0);
            }
        });
        
        categorySelect.addEventListener('focus', () => categoryArrow.classList.add('rotate'));
        categorySelect.addEventListener('blur', () => categoryArrow.classList.remove('rotate'));
    }
});

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
    arrow.classList.add('rotate');
}

function closeSelectDropdown(select, arrow) {
    select.blur();
    arrow.classList.remove('rotate');
}