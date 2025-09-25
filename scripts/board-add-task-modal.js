/**
 * Shows the "Add Task" modal by adding the 'show' class, hiding body overflow,
 * and adding an event listener for clicks outside the modal.
 */
function showAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    modal.addEventListener('click', handleOutsideClick);
}

/**
 * Closes the "Add Task" modal by hiding it, restoring the body's overflow style,
 * and removing the event listener for clicks outside the modal.
 */
function closeAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';

    modal.removeEventListener('click', handleOutsideClick);
}

/**
 * Handles clicks outside the modal to close it if the click target is the modal itself.
 * @param {Event} event - The click event.
 */
function handleOutsideClick(event) {
    if (event.target === event.currentTarget) {
        closeAddTaskModal();
    }
}

/**
 * Sets the status for the task to be added and shows the "Add Task" modal.
 * @param {string} status - The status to assign to the new task.
 */
function addTaskBoard(status) {
    taskToAddStatus = status;
    showAddTaskModal();
}