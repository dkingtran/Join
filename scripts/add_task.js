// =====================
// Task Data & Validation
// =====================

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

// =====================
// Assigned To Dropdown
// =====================

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

// =====================
// Form & UI Events
// =====================

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

document.addEventListener("DOMContentLoaded", () => {
    setupCheckboxListener();
    loadContactsIntoDropdown();
    setupCategoryDropdown();
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

// =====================
// Utility
// =====================

function rotateCategoryArrow(rotate) {
    const arrow = document.getElementById("category-arrow");
    if (arrow) {
        arrow.classList.toggle("rotate", rotate);
    }
}