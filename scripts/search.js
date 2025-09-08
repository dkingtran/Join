
document.getElementById('searchInput').addEventListener("input", debounce(handleSearch, 250));

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