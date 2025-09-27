
document.getElementById('searchInput').addEventListener("input", debounce(handleSearch, 250));

/**
 * Handles the search input event for filtering and displaying tasks.
 * Updates the displayedTasks array based on the search query and renders the filtered tasks.
 * Shows or hides the "no results" message depending on whether any tasks match the search.
 *
 * @param {Event} event - The input event triggered by the search field.
 */
function handleSearch(event) {
    const value = event.target.value.toLowerCase();
    document.getElementById('search-empty-message').classList.add('d-none');
    if (value == "") {
        displayedTasks = tasks;
        renderAllTasks();
        return;
    }
    displayedTasks = filterTasks(value);
    if (displayedTasks.length == 0) {
        renderAllTasks();
        document.getElementById('search-empty-message').classList.remove('d-none');
    } else {
        renderAllTasks();
    }
}

/**
 * Filters the global `tasks` array to include only tasks whose title or description
 * contains the specified search value (case-insensitive).
 *
 * @param {string} value - The search string to filter tasks by.
 * @returns {Array<Object>} An array of task objects that match the search criteria.
 */
function filterTasks(value) {
    return tasks.filter(task => {
        let taskTitle = task.title.toLowerCase();
        let taskDescription = task.description.toLowerCase();
        return (
            taskTitle.includes(value) ||
            taskDescription.includes(value)
        );
    });
}