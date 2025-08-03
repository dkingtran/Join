let title = [];
let selectedPriority = "";
let task = [];
let subtask = [];
let assignedTo = [];

const btnUrgent = document.getElementById("urgent");
const btnMedium = document.getElementById("medium");
const btnLow = document.getElementById("low");

/**
 * Retrieves all form data for a task and returns it as an object.
 * Uses a shorthand for `getElementById(...).value.trim()` to simplify the code.
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


function checkTitleDateInput() {
  let titleOk = validateTitleInput();
  let dateOk = validateDateInput();

  if (titleOk && dateOk) {
    return true;
  } else {
    return false;
  }
}

function validateTitleInput() {
  const titleInput = document.getElementById('title-task');
  const titleError = document.querySelector('#title-error-border .error-text');
  const isEmpty = titleInput.value.trim() === "";

  if (isEmpty) {
    titleInput.classList.add("border-red");
    titleError.classList.remove("d-none");
    return false;
  } else {
    titleInput.classList.remove("border-red");
    titleError.classList.add("d-none");
    return true;
  }
}

function validateDateInput() {
  const dateInput = document.getElementById('task-date');
  const dateError = document.querySelector('#date-error-border .error-text');
  const isEmpty = dateInput.value.trim() === "";

  if (isEmpty) {
    dateInput.classList.add("border-red");
    dateError.classList.remove("d-none");
    return false;
  } else {
    dateInput.classList.remove("border-red");
    dateError.classList.add("d-none");
    return true;
  }
}

/**
 * Removes all active color classes from the priority buttons.
 * This ensures only one button is visibly active at any time.
 */

function resetButtons() {
    btnUrgent.classList.remove("active-red");
    btnMedium.classList.remove("active-yellow");
    btnLow.classList.remove("active-green");
}

/**
 * Activates the given button by applying the corresponding color class.
 * Also resets all other buttons beforehand.
 * If the "medium" button is selected, it changes its icon as well.
 * 
 * @param {HTMLElement} button - The button to activate
 * @param {string} colorClass - The CSS class for the active color state
 */

function activateButton(button, colorClass) {
    resetButtons();
    button.classList.add(colorClass);
    selectedPriority = button.id;
    if (button.id === "medium") {
        setMediumIcon(true);
    } else {
        setMediumIcon(false);
    }
}

/**
 * Switches the icon of the medium priority button.
 * 
 * @param {boolean} active - true = use active icon, false = use default icon
 */
function setMediumIcon(active) {
    const icon = document.getElementById("medium-icon");
    if (active) {
        icon.src = "./assets/img/icons/add_task/medium_vector.svg";
    } else {
        icon.src = "./assets/img/icons/add_task/prio_medium_orange.svg";
    }
}

/**
 * Handles click on the "Urgent" button.
 * Prevents form submission and applies the red style.
 */
btnUrgent.addEventListener("click", function (event) {
    event.preventDefault();
    activateButton(btnUrgent, "active-red");
});

/**
 * Handles click on the "Medium" button.
 * Prevents form submission, applies yellow style, and changes icon.
 */
btnMedium.addEventListener("click", function (event) {
    event.preventDefault();
    activateButton(btnMedium, "active-yellow");
});

/**
 * Handles click on the "Low" button.
 * Prevents form submission and applies the grenn style.
 */
btnLow.addEventListener("click", function (event) {
    event.preventDefault();
    activateButton(btnLow, "active-green");
});

// Assigned
/**
 * Toggles the visibility of the dropdown list when clicked.
 * - Prevents the click event from bubbling up to avoid closing the dropdown unintentionally.
 * - Switches the display of the contact list between "block" and "none".
 * - Toggles the rotation class on the arrow for visual feedback.
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
 * 
 * - Checks if the click occurred inside the dropdown input or a contact item.
 * - If the click was outside both, it closes the dropdown and resets the arrow.
 * 
 * @param {Event} event - The click event on the document.
 */
function handleDropdownClick(event) {
    const clickedInsideInput = event.target.closest(".dropdown-input");
    const clickedContactItem = event.target.closest(".contact-item");
    checkClickOutside(clickedInsideInput, clickedContactItem);
}

/**
 * Closes the contact dropdown if the user clicked outside both
 * the dropdown input field and the contact list items.
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
 * based on the provided boolean value.
 * 
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
 * When this function is called (e.g., by clicking on the container), it finds
 * the checkbox inside, inverts its 'checked' state, and dispatches a 'change' event.
 * This allows the user to check/uncheck the box by clicking on the entire
 * clickable area, improving usability.
 *
 * @param {HTMLElement} container The HTML element container that holds the checkbox.
 */
function toggleCheckboxContact(container) {
    const checkbox = container.querySelector(".contact-checkbox");
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
}

/**
 * Adds a change listener to each contact checkbox.
 * Whenever a checkbox is toggled (on/off),
 * it triggers an update of the assigned list.
 */

function setupCheckboxListener() {
    const checkboxes = document.querySelectorAll(".contact-checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        checkbox.addEventListener("change", updateAssignedList);
    }
}

/**
 * Collects all currently checked contacts.
 * Updates the visible input field with their names
 * and stores the selected names in the `assignedTo` array.
 */

function updateAssignedList() {
    const checkboxes = document.querySelectorAll(".contact-checkbox");
    const input = document.getElementById("searchInput");
    const selected = [];

    for (let j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].checked) {
            selected.push(checkboxes[j].dataset.name);
        }
    }
    input.value = selected.join(", ");
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
        const name = contact.name;
        const initials = name["first-name"][0] + name["last-name"][0];
        list.innerHTML += getAssignedNameTemplate(initials, name);
        console.log(contact);
    }
    setupCheckboxListener();
}

const initialBox = document.getElementById("subtask-initial");
const activeBox = document.getElementById("subtask-active");
const inputField = document.getElementById("subtask-input-second");

/**
 * Displays the active subtask input field by hiding the initial field
 * and showing the one where the user can type a new subtask.
 */
function showSubtaskInput() {
    initialBox.classList.add("d-none");
    activeBox.classList.remove("d-none");
}

/**
 * Resets the subtask input to its initial state.
 * Hides the active input field, shows the placeholder input, and clears the input value.
 */

function cancelSubtaskInput() {
    activeBox.classList.add("d-none");
    initialBox.classList.remove("d-none");
    inputField.value = "";
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
 * Generates subtask HTML, displays it in the output box,
 * and stores the subtask text in the subtask array.
 * @param {string} text - The subtask text to add
 */
function renderAndStoreSubtask(text) {
    const outputBox = document.getElementById("subtask-output");
    const subtaskHtml = getSubtaskTemplate(text);
    outputBox.innerHTML += subtaskHtml;
    subtask.push(text);
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
 * Instead of relying on a separate JavaScript array (which can become outdated),
 * this function fetches all subtask elements that are currently visible on the page.
 * This ensures that the returned list is always accurate – including any additions,
 * deletions, or edits made by the user.
 * Returns:
 *   An array of strings representing the visible subtask texts.
 */

function collectSubtasksFromDOM() {
    const subtaskDivs = document.querySelectorAll(".subtask-entry");
    const collected = [];
    for (let i = 0; i < subtaskDivs.length; i++) {
        collected.push(subtaskDivs[i].innerText.trim());
    }
    return collected;
}

/**
 * Deletes a specific subtask from the DOM and removes it from the subtask array.
 * Triggered by clicking the delete icon. It finds the surrounding .subtask-text-box,
 * removes it from the DOM, and deletes the matching text from the array.
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
 * Replaces the displayed text with an input field and switches the icons.
 */
function startEditSubtask(element) {
    const { box, textElement, iconBox } = getSubtaskParts(element);
    const text = textElement.innerText;
    iconBox.querySelector(".edit-icon").classList.add("d-none");
    iconBox.querySelector(".confirm-icon").classList.remove("d-none");
    textElement.outerHTML = changeDivtoInputTemplate(text);
}

/**
 * Finishes the subtask editing.
 * Converts the input back into a regular div and resets the icons.
 */
function finishEditSubtask(iconElement) {
    const { box, iconBox } = getSubtaskParts(iconElement);
    const inputElement = box.querySelector("input.subtask-entry");
    const text = inputElement.value.trim();
    inputElement.outerHTML = getReturnToDivTemplate(text);
    iconBox.querySelector(".edit-icon")?.classList.remove("d-none");
    iconBox.querySelector(".confirm-icon")?.classList.add("d-none");
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
 * Handles the form submission for creating a new task.
 * Prevents page reload, collects form data, sends it to Firebase,
 * shows a temporary success message, and resets the form and subtasks.
 */

function showSuccessMessage() {
  const messageBox = document.getElementById("task-message");
  messageBox.classList.remove("d-none");
  hideMessageAfterDelay(messageBox, 3000);
}

/**
 * Hides a given element after a specified delay.
 * 
 * Adds the CSS class "d-none" to the element after the delay (default is 3000 ms),
 * effectively hiding it from view.
 * 
 * @param {HTMLElement} element - The DOM element to hide
 * @param {number} [delay=3000] - Delay in milliseconds before hiding the element
 */
function hideMessageAfterDelay(element, delay = 3000) {
  setTimeout(() => {
    element.classList.add("d-none");
  }, delay);
}

/**
 * Resets the form and clears subtasks.
 * Resets the form with ID "form-element", clears the inner HTML of the
 * subtask output container, resets the subtask array, and calls
 * cancelSubtaskInput() to clear or update the subtask input UI.
 */
function resetFormAndSubtasks() {
  document.getElementById("form-element").reset();
  document.getElementById("subtask-output").innerHTML = "";
  subtask = [];
  cancelSubtaskInput();
}

/**
 * Form submission event listener with validation and data posting.
 * Prevents the default form submit behavior, validates inputs using checkTitleDateInput(),
 * retrieves form data, sends it asynchronously to the server, shows a success message,
 * and resets the form and subtasks after successful submission.
 */
document.getElementById("form-element").addEventListener("submit", async function (event) {
  event.preventDefault();
  if (!checkTitleDateInput()) return;
  const taskData = getTaskData();
  await postData("tasks", taskData);
 if (checkTitleDateInput()) {
  showSuccessMessage();
}
  resetFormAndSubtasks();
});

/**
 * Closes the contact dropdown when the user clicks outside of it.
 * Ensures the dropdown collapses and the arrow resets.
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
    document.getElementById("subtask-output").innerHTML = "";
    const errorTexts = document.querySelectorAll(".error-text");
    for (let i = 0; i < errorTexts.length; i++) {
        errorTexts[i].classList.add("d-none");
    }
    const redBorders = document.querySelectorAll(".border-red");
    for (let i = 0; i < redBorders.length; i++) {
        redBorders[i].classList.remove("border-red");
    }
    resetButtons(); 
    cancelSubtaskInput();  
}

function showSuccessMessage() {
  const messageBox = document.getElementById('task-message');
  // Startanzeige vorbereiten
  messageBox.classList.remove('d-none');
  // Leicht verzögern, damit Transition wirkt
  setTimeout(() => {
    messageBox.classList.add('show');
  }, 10);
  // Nach 3 Sekunden wieder verschwinden lassen
  setTimeout(() => {
    messageBox.classList.remove('show');
    // Nach der Animation wieder aus dem DOM-Fluss nehmen
    setTimeout(() => {
      messageBox.classList.add('d-none');
    }, 500); // entspricht der CSS-Transition-Zeit
  }, 1000);
}



/**
 * Closes the contact dropdown when the user clicks outside of it.
 * Ensures the dropdown collapses and the arrow resets.
 */
window.onload = () => {
    setupCheckboxListener();
    loadContactsIntoDropdown();
};