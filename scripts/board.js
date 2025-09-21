let tasks = [];
let displayedTasks = [];
let contacts = [];

async function init() {
    await updateTasksArrays();
    await getContactsArray();
}

async function updateTasksArrays() {
    await getTasksArray();
    displayedTasks = tasks;
}

async function getTasksArray() {
  tasks = [];
  const taskObjects = await loadData("/tasks/");
  if (!taskObjects) {
    console.warn("no tasks available.");
    return;
  }
  for (const taskId in taskObjects) {
    if (taskObjects.hasOwnProperty(taskId)) {
      tasks.push({ id: taskId, ...taskObjects[taskId] });
    }
  }
}

/**
 * @async
 * @function
 * 
 * Asynchronously loads contact objects from the "/contacts/" endpoint and populates the global `contacts` array.
 */
async function getContactsArray() {
    contacts = [];
    let contactObjects = await loadData("/contacts/");
    if (!contactObjects) {
        console.warn("no contacts available.");
        return;
    }
    Object.keys(contactObjects).forEach(key => {
        contacts.push(contactObjects[key]);
    });
}

