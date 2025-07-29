const btnUrgent = document.getElementById("urgent");
const btnMedium = document.getElementById("medium");
const btnLow = document.getElementById("low");

/**
 * Removes all active color classes from the priority buttons.
 * This ensures only one button is visibly active at any time.
 */
function resetButtons() {
    btnUrgent.classList.remove("active-green");
    btnMedium.classList.remove("active-yellow");
    btnLow.classList.remove("active-red");
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

    // Only switch the icon for the medium priority button
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
 * Prevents form submission and applies the green style.
 */
btnUrgent.addEventListener("click", function (event) {
    event.preventDefault();
    activateButton(btnUrgent, "active-green");
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
 * Prevents form submission and applies the red style.
 */
btnLow.addEventListener("click", function (event) {
    event.preventDefault();
    activateButton(btnLow, "active-red");
});


// Assigned

function toggleDropdown() {
  const list = document.getElementById("contactList");
  const arrow = document.querySelector(".arrow");
  list.style.display = list.style.display === "block" ? "none" : "block";
  arrow.classList.toggle("rotate");
}

function setupCheckboxListener() {
  const checkboxes = document.querySelectorAll(".contact-checkbox");
  const input = document.getElementById("searchInput");
  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    checkbox.addEventListener("change", () => {
      const ausgewählt = [];
      for (let j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].checked) {
          ausgewählt.push(checkboxes[j].dataset.name);
        }
      }
      input.value = ausgewählt.join(", ");
    });
  }
}
window.onload = () => {
  setupCheckboxListener();
};

// Subtask Input Field
function showSubtaskInput() {
  const initialBox = document.getElementById("subtask-initial");
  const activeBox = document.getElementById("subtask-active");

  initialBox.classList.add("d_none");
  activeBox.classList.remove("d_none");
}

function cancelSubtaskInput() {
  const initialBox = document.getElementById("subtask-initial");
  const activeBox = document.getElementById("subtask-active");
  const inputField = document.getElementById("subtask-input-second");

  activeBox.classList.add("d_none");    // versteckt das Eingabefeld
  initialBox.classList.remove("d_none"); // zeigt das erste Feld wieder
  inputField.value = "";                // löscht den eingegebenen Text
}

window.onload = () => {
  setupCheckboxListener();
};


