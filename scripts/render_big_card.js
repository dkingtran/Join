async function initRender() {
  const [tasksData, contactsData] = await Promise.all([
    loadData("tasks"),
    loadData("contacts")
  ]);
  renderAllBigCards(tasksData, contactsData);
}

function renderAllBigCards(tasksData, contactsData) {
  const container = getContainer("#big-card-list");
  if (!tasksData || typeof tasksData !== "object") return;
  const html = buildAllCardsHTML(tasksData, contactsData);
  container.innerHTML = html;
}

// 🔹 Hilfsfunktionen
function getContainer(selector) {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`${selector} nicht gefunden`);
  el.innerHTML = "";
  return el;
}

function buildAllCardsHTML(tasksData, contactsData) {
  let html = "";
  const taskIds = Object.keys(tasksData);
  for (let taskIndex = 0; taskIndex < taskIds.length; taskIndex++) {
    const taskId = taskIds[taskIndex];
    const taskData = tasksData[taskId];
    html += buildSingleCardHTML(taskData, taskId, contactsData);
  }
  return html;
}

function buildSingleCardHTML(task, taskId, contactsData) {
  const category = task["category"] || "";
  const title = task["title"] || "";
  const desc = task["description"] || "";
  const due = task["due-date"] || "";
  const prio = task["priority"] || "";
  const avatarsHTML = buildAvatarsHTML(task["assigned-to"] || [], contactsData);
  const subtasksHTML = buildSubtasksHTML(task["subtasks"] || [], taskId);
  return bigCardTemplate(taskId, category, title, desc, due, prio, avatarsHTML, subtasksHTML);
}

function buildAvatarsHTML(assignedList, contactsData) {
  let avatarsHTML = "";
  if (!Array.isArray(assignedList)) return avatarsHTML;
  for (let idx = 0; idx < assignedList.length; idx++) {
    const fullName = assignedList[idx] || "";
    const initials = getInitials(fullName);
    const bgColor  = findContactColor(fullName, contactsData) || "#ccc";
    avatarsHTML += avatarItemTemplate(initials, bgColor, fullName);
  }
  return avatarsHTML;
}


function findContactColor(contactName, contactsData) {
  if (!contactsData || typeof contactsData !== "object") return null;
  const contactIds = Object.keys(contactsData);
  for (let contactIndex = 0; contactIndex < contactIds.length; contactIndex++) {
    const contact = contactsData[contactIds[contactIndex]];
    if (contact?.name) {
      const fullName = `${contact.name["first-name"] || ""} ${contact.name["last-name"] || ""}`.trim();
      if (fullName.toLowerCase() === contactName.toLowerCase()) {
        if (contact.color && contact.color.startsWith("bg-")) {
          return "#" + contact.color.slice(3);
        }
      }
    }
  }
  return null;
}


// Kürzen
function buildSubtasksHTML(subtasks, taskId) {
  let subtasksHTML = "";
  if (!subtasks || typeof subtasks !== "object") return subtasksHTML;
  const subtaskKeys = Object.keys(subtasks);
  for (let subtaskIdx = 0; subtaskIdx < subtaskKeys.length; subtaskIdx++) {
    const subtaskId  = subtaskKeys[subtaskIdx];
    const obj        = subtasks[subtaskId];
    if (!obj) continue;
    const subText = typeof obj === "object" ? (obj.subtask || "") : String(obj);
    const isDone  = typeof obj === "object" ? obj.done === true : false;
    subtasksHTML += subtaskItemTemplate(taskId, subtaskId, subText, isDone);
  }
  return subtasksHTML;
}

function renderAddTaskOverlay(){
  let addTaskOverlay = document.getElementById("add-task-overlay");
      addTaskOverlay.innerHTML = addTaskOverlayTemplate();
}

renderAddTaskOverlay()
initRender();
