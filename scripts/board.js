/**
 * Global array holding all tasks retrieved from the backend.
 * Each task may include an `id` and other properties like `title`, `status`, etc.
 * @type {Object[]}
 */
let tasks = [];

/**
 * Global array containing tasks currently displayed on the UI.
 * This can be filtered from `tasks`.
 * @type {Object[]}
 */
let displayedTasks = [];

/**
 * Global array holding all contact objects retrieved from the backend.
 * Each contact should include fields like `name`, `color`, etc.
 * @type {Object[]}
 */
let contacts = [];

/**
 * Initializes the board data by loading tasks and contacts.
 * - Populates `tasks`, `displayedTasks`, and `contacts`.
 * @async
 * @function
 */
async function init() {
    await updateTasksArrays();
    await getContactsArray();
}

/**
 * Updates both the `tasks` and `displayedTasks` arrays with the latest data.
 * - `displayedTasks` will initially mirror `tasks`.
 * @async
 * @function
 */
async function updateTasksArrays() {
    await getTasksArray();
    displayedTasks = tasks;
}

/**
 * Loads all tasks from Firebase and stores them in the global `tasks` array.
 * - Adds the task `id` to each task object for tracking.
 * - If no tasks are found, logs a warning.
 * @async
 * @function
 */
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
 * Loads all contacts from Firebase and stores them in the global `contacts` array.
 * - If no contacts are found, logs a warning.
 * @async
 * @function
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

