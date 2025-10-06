let selectedPriority = "";
let subtasksById = {};
let subtask = [];
let assignedTo = [];
let taskToAddStatus = "to-do";
const initialBox = document.getElementById("subtask-initial");
const activeBox = document.getElementById("subtask-active");
const inputField = document.getElementById("subtask-input-second");

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
        status: getTaskStatus(taskToAddStatus)
    };
}

/**
 * Returns an object representing the status of each category, 
 * where the specified status is set to true and all others are set to false.
 *
 * @param {string} status - The status to be set as true.
 * @returns {Object} An object with category statuses as keys and boolean values.
 */
function getTaskStatus(status) {
    let newStatus = {};
    Object.values(categories).forEach((stat) => {
        if (stat == status) {
            newStatus[stat] = true;
        } else {
            newStatus[stat] = false;
        }
    });
    return newStatus;
}

/** Validates the task title input and toggles error display. @returns {boolean} True if valid. */
function validateTitleInput() {
    const titleInput = document.getElementById('title-task');
    const titleError = document.querySelector('#title-error-border .error-text');
    const isValid = titleCheck(titleInput.value);
    titleInput.classList.toggle("border-red", !isValid);
    titleError.classList.toggle("d-none", isValid);
    return isValid;
}

/** Validates the task date input and toggles error display. @returns {boolean} True if valid. */
function validateDateInput() {
    const dateInput = document.getElementById('task-date');
    const dateError = document.querySelector('#date-error-border .error-text');
    const isValid = dateCheck(dateInput.value);
    dateInput.classList.toggle("border-red", !isValid);
    dateError.classList.toggle("d-none", isValid);
    return isValid;
}

/** Validates the task category input and toggles error display. @returns {boolean} */
function validateCategoryInput() {
    const select = document.getElementById('task-category');
    const errorEl = document.querySelector('#category-error-border .error-text');
    const wrapper = select ? select.closest('.select-container') : null;
    const isValid = !!(select && select.value.trim() !== "");
    if (select) select.classList.toggle('border-red', !isValid);
    if (wrapper) wrapper.classList.toggle('border-red', !isValid);
    if (errorEl) errorEl.classList.toggle('d-none', isValid);

    return isValid;
}

/** Checks both title and date inputs for validity. @returns {boolean} True if both are valid. */
function checkTitleDateInput() {
    const titleOk = validateTitleInput();
    const dateOk = validateDateInput();
    const categoryOk = validateCategoryInput();
    return titleOk && dateOk && categoryOk;
}

/**
 * Toggles the visibility of the contact dropdown using inline style.
 * @param {Event} event - The click event triggering the dropdown toggle.
 */
function toggleDropdown(event) {
    event.stopPropagation();
    const list = document.getElementById("contactList");
    const arrow = document.querySelector(".arrow");
    const visible = list.style.display === "block";
    list.style.display = visible ? "none" : "block";
    arrow.classList.toggle("rotate", !visible);
}

/** Handles a dropdown click by checking if it occurred inside the input or a contact item. */
function handleDropdownClick(event) {
    const clickedInsideInput = event.target.closest(".dropdown-input");
    const clickedContactItem = event.target.closest(".contact-item");
    checkClickOutside(clickedInsideInput, clickedContactItem);
}

/** Closes the contact dropdown if the click happened outside input and contact items. */
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
        ? containerOrCheckbox.closest(".contact-item")
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

/** Adds a change listener to each contact checkbox. */
function setupCheckboxListener() {
    const checkboxes = document.querySelectorAll(".contact-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        checkbox.addEventListener("change", updateAssignedList);
    }
}

/** Checks all currently selected (checked) fields */
function createAvatar(initials, color) {
    const avatar = document.createElement("span");
    avatar.classList.add("avatar", "display-standard");
    avatar.style.backgroundColor = color;
    avatar.textContent = initials;
    return avatar;
}

/** 
 * Processes a checked contact by extracting its data, adding the name to the selection,
 * creating an avatar, and appending it to the selected container.
 * @param {HTMLElement} checkbox - The checkbox element of the contact.
 * @param {string[]} selected - The array that stores selected contact names.
 * @param {HTMLElement} selectedContainer - The container where avatars are displayed.
 */

function processCheckedContact(checkbox, selected, selectedContainer) {
    const name = checkbox.dataset.name;
    const initials = checkbox.dataset.initials;
    const color = checkbox.closest(".contact-item")
        .querySelector(".avatar").style.backgroundColor;
    selected.push(name);
    const avatar = createAvatar(initials, color);
    selectedContainer.appendChild(avatar);
}

/** Updates the assigned contacts list and renders their avatars. */
function updateAssignedList() {
    const checkboxes = document.querySelectorAll(".contact-checkbox");
    const selectedContainer = document.getElementById("selectedContacts");
    const selected = getSelectedContacts(checkboxes);
    assignedTo = selected.map(item => item.name);
    renderSelectedAvatars(selected, selectedContainer);
}

/** Returns an array of selected contacts with name, initials, and color. */
function getSelectedContacts(checkboxes) {
    const selected = [];
    for (let j = 0; j < checkboxes.length; j++) {
        const checkbox = checkboxes[j];
        if (checkbox.checked) {
            const name = checkbox.dataset.name;
            const initials = checkbox.dataset.initials;
            const color = checkbox.closest(".contact-item")
                .querySelector(".avatar").style.backgroundColor;
            selected.push({ name, initials, color });
        }
    }
    return selected;
}

/** Renders up to 5 avatars and a "+N" overflow avatar if needed. */
function renderSelectedAvatars(selected, container) {
    container.innerHTML = "";
    const maxAvatars = 5;
    for (let i = 0; i < Math.min(selected.length, maxAvatars); i++) {
        const { initials, color } = selected[i];
        const avatar = createAvatar(initials, color);
        container.appendChild(avatar);
    }
    if (selected.length > maxAvatars) {
        const overflowCount = selected.length - maxAvatars;
        const overflowAvatar = document.createElement("span");
        overflowAvatar.classList.add("avatar", "display-standard");
        overflowAvatar.style.backgroundColor = "#2A3647";
        overflowAvatar.textContent = `+${overflowCount}`;
        container.appendChild(overflowAvatar);
    }
}

/** Loads all contacts from Firebase and displays them in the dropdown menu. */
async function loadContactsIntoDropdown() {
    const data = await loadData("contacts");
    const list = document.getElementById("contactList");
    list.innerHTML = "";
    const contacts = Object.values(data);
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const prepared = prepareContactData(contact);
        renderContactToDropdown(prepared, list);
    }
    setupCheckboxListener();
}

/** Prepares contact data with initials and color for rendering. */
function prepareContactData(contact) {
    const name = contact.name;
    const initials = name["first-name"][0] + name["last-name"][0];
    const colorClass = contact.color || "bg-cccccc";
    const hexColor = "#" + colorClass.replace("bg-", "");
    return { initials, name, hexColor };
}

/** Renders a contact entry into the dropdown list. */
function renderContactToDropdown({ initials, name, hexColor }, container) {
    container.innerHTML += getAssignedNameTemplate(initials, name, hexColor);
}

/** Form submission event listener with validation and data posting. */
document.getElementById("form-element").addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!checkTitleDateInput()) return;
    const taskData = getTaskData();
    await postData("tasks", taskData);
    showSuccessMessage();
    resetFormState();
});

/** Closes the contact dropdown when the user clicks outside of it. */
document.addEventListener("click", function (event) {
    const dropdown = document.querySelector(".custom-dropdown");
    const list = document.getElementById("contactList");
    if (!dropdown.contains(event.target)) {
        list.style.display = "none"; // Dropdown schließen
        document.querySelector(".arrow").classList.remove("rotate");
    }
});

/** Sets the default priority to "medium" and updates the UI accordingly. */
function setDefaultPriority() {
    selectedPriority = "medium";
    document.querySelectorAll(".priority-btn").forEach(btn => btn.classList.remove("active-yellow"));
    const mediumBtn = document.getElementById("medium");
    if (mediumBtn) mediumBtn.classList.add("active-yellow");
};

document.addEventListener("DOMContentLoaded", () => {
    setDefaultPriority();
    setupCheckboxListener();
    loadContactsIntoDropdown();
    setupCategoryDropdown();
});

/** Resets the task form, clears subtasks/contacts, removes errors and restores default UI state. */

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

/** Shows a success message briefly, then hides it and redirects to the board page. */
function showSuccessMessage() {
    const messageBox = document.getElementById('task-message');
    messageBox.classList.remove('d-none');
    setTimeout(() => {
        messageBox.classList.add('show');
    }, 10);
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
    setTimeout(() => {
        messageBox.classList.add('d-none');
        window.location.href = "board.html";
    }, 1500);
}

/**
 * Rotates the category arrow visually by toggling the "rotate" CSS class.
 * @param {boolean} rotate - If true, adds the "rotate" class (arrow rotates).
 */
function rotateCategoryArrow(rotate) {
    const arrow = document.getElementById("category-arrow");
    if (arrow) {
        arrow.classList.toggle("rotate", rotate);
    }
}

/**
 * Initializes the category dropdown behavior by linking the select element .
 * @function
 * @returns {void}
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
 * Toggles the category dropdown state between open and closed.  
 * @function
 * @returns {void}
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
 * Opens the category dropdown programmatically by focusing the select element 
 * @param {HTMLSelectElement} select - The select element representing the dropdown menu.
 * @param {HTMLElement} arrow - The arrow element that visually indicates dropdown state.
 * @returns {void}
 */
function openSelectDropdown(select, arrow) {
    select.focus();
    select.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

/**
 * Closes the category dropdown by removing focus from the select element .
 * @param {HTMLSelectElement} select - The select element representing the dropdown menu.
 * @param {HTMLElement} arrow - The arrow element that visually indicates dropdown state.
 * @returns {void}
 */
function closeSelectDropdown(select, arrow) {
    select.blur();
    arrow.classList.remove('rotate');
}

