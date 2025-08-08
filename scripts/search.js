
document.getElementById('search').addEventListener("input", debounce(handleSearch, 250));

function handleSearch(event) {
    const value = event.target.value.toLowerCase();
    if (value == "") {
        renderTasks();
        return;
    }
    displayedTasks = filterTasks(value);
    if (displayedTasks.length == 0) {
        searchNotFound();
    } else {
        renderTasks();
    }
}

function filterTasks(value) {
    return displayedTasks = tasks.filter(task => {
        let taskTitle = task.title.toLowerCase();
        let taskDescription = task.description.toLowerCase();
        return (
            taskTitle.includes(value) ||
            taskDescription.includes(value)
        );
    });
}