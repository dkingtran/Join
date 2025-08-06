const btnUrgent = document.getElementById("urgent");
const btnMedium = document.getElementById("medium");
const btnLow = document.getElementById("low");

/**
 * Removes all active color classes from the priority buttons.
 */
function resetButtons() {
    btnUrgent.classList.remove("active-red");
    btnMedium.classList.remove("active-yellow");
    btnLow.classList.remove("active-green");
}

/**
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
 */
btnUrgent.addEventListener("click", function (event) {
    event.preventDefault();
    activateButton(btnUrgent, "active-red");
});

/**
 * Handles click on the "Medium" button.
 */
btnMedium.addEventListener("click", function (event) {
    event.preventDefault();
    activateButton(btnMedium, "active-yellow");
});

/**
 * Handles click on the "Low" button.
 */
btnLow.addEventListener("click", function (event) {
    event.preventDefault();
    activateButton(btnLow, "active-green");
});
