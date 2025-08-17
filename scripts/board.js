let tasks = [];

let displayedTasks = [];

async function init() {
    await getTasksArray();
}

async function getTasksArray() {
    let contactObjects = await loadData("/tasks/");
    Object.keys(contactObjects).forEach(key => {
        tasks.push(contactObjects[key]);
    });
}