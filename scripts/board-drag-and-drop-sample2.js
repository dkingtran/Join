let draggedEl = null;
let placeholder = null;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let startX = 0, startY = 0;
const DRAG_THRESHOLD = 10; // Minimum pixels to move before considering it a drag

// Global variable for other scripts to check drag state
window.dragged = null;

// Add global variables to track original position
let originalTasksList = null;
let originalIndex = -1;

// === Board Rendering ===
/**
 * Updates empty messages for task lists by checking if lists are empty and adding/removing messages accordingly.
 */
function updateEmptyMessages() {
    document.querySelectorAll(".tasks-list").forEach((list) => {
        checkAndHandleEmptyList(list);
    });
}

/**
 * Checks if a task list is empty and handles adding or removing the empty message.
 * @param {HTMLElement} list - The tasks list element.
 */
function checkAndHandleEmptyList(list) {
    const tasks = Array.from(list.children).filter((c) =>
        c.classList.contains("board-card")
    );
    let msg = list.querySelector(".empty-msg");
    if (tasks.length === 0) {
        if (!msg) {
            addEmptyMessage(list);
        } else {
            msg.style.display = '';
        }
    } else {
        if (msg) msg.remove();
    }
}

/**
 * Adds an empty message to the list based on the column header.
 * @param {HTMLElement} list - The tasks list element.
 */
function addEmptyMessage(list) {
    let header = list.parentElement.querySelector(".column-header");
    let headerText = (header ? header.textContent : "");
    list.innerHTML = getKanbanEmptyMessage(headerText);
}

/**
 * Renders the board with no-tasks areas and adds drag events to cards.
 */
function renderWithNoTasksAreas() {
    updateEmptyMessages();
    addDragEventsToCards();
}

// === Drag Setup ===
/**
 * Adds mouse down event listeners to board cards for drag functionality, ensuring events are attached only once.
 */
function addDragEventsToCards() {
    document.querySelectorAll('.board-card').forEach(card => {
        // Nur einmal anhängen
        if (!card.dataset.dragEventsAttached) {
            card.addEventListener('mousedown', onMouseDown);
            card.dataset.dragEventsAttached = "true";
        }
    });
}

/**
 * Handles the mouse down event on a board card, initializing drag state and event listeners.
 * @param {MouseEvent} e - The mouse down event.
 */
function onMouseDown(e) {
    draggedEl = e.target.closest('.board-card');
    if (!draggedEl) return;
    initializeDragState(e);
    setupDragEvents();
}

/**
 * Initializes the drag state with start position and offsets.
 * @param {MouseEvent} e - The mouse down event.
 */
function initializeDragState(e) {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;
    window.dragged = null; // Reset dragged state
    const rect = draggedEl.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    // Capture original position
    originalTasksList = draggedEl.parentElement;
    originalIndex = Array.from(originalTasksList.children).indexOf(draggedEl);
}

/**
 * Sets up event listeners for mouse move and mouse up.
 */
function setupDragEvents() {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp, { once: true });
}

// === Placeholder Management ===
/**
 * Creates placeholder elements in the current and adjacent board columns for drop zones.
 */
function createPlaceholdersInAdjacentZones() {
    const currentColumn = draggedEl.closest('.board-column');
    const currentColumnIndex = parseInt(currentColumn.dataset.columnIndex);
    document.querySelectorAll('.board-column').forEach((column) => {
        createPlaceholderIfAdjacent(column, currentColumnIndex);
    });
}

/**
 * Creates a placeholder in a column if it is adjacent to the current column.
 * @param {HTMLElement} column - The board column element.
 * @param {number} currentColumnIndex - The index of the current column.
 */
function createPlaceholderIfAdjacent(column, currentColumnIndex) {
    const columnIndex = parseInt(column.dataset.columnIndex);
    if (Math.abs(columnIndex - currentColumnIndex) <= 1) {
        const tasksList = column.querySelector('.tasks-list');
        if (tasksList) {
            addPlaceholderToList(tasksList);
        }
    }
}

/**
 * Adds a placeholder element to the tasks list.
 * @param {HTMLElement} tasksList - The tasks list element.
 */
function addPlaceholderToList(tasksList) {
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.style.opacity = '0.9';
    tasksList.appendChild(placeholder);

    // Hide "No Tasks..." message if the list is empty
    const tasks = Array.from(tasksList.children).filter(c => c.classList.contains("board-card"));
    if (tasks.length === 0) {
        const msg = tasksList.querySelector(".empty-msg");
        if (msg) msg.style.display = 'none';
    }
}

// === Drag Movement ===
/**
 * Moves the dragged element to the specified page coordinates, accounting for offset.
 * @param {number} pageX - The x-coordinate on the page.
 * @param {number} pageY - The y-coordinate on the page.
 */
function moveAt(clientX, clientY) {
    draggedEl.style.left = clientX - offsetX + 'px';
    draggedEl.style.top = clientY - offsetY + 'px';
}

/**
 * Handles the mouse move event, checking for drag threshold and updating drag state or highlighting drop zones.
 * @param {MouseEvent} e - The mouse move event.
 */
function onMouseMove(e) {
    if (!draggedEl) return;
    if (shouldStartDrag(e)) {
        isDragging = true;
        startDrag(e);
    }
    if (isDragging) {
        handleDragMovement(e);
    }
}

/**
 * Checks if the mouse movement exceeds the drag threshold.
 * @param {MouseEvent} e - The mouse move event.
 * @returns {boolean} True if drag should start.
 */
function shouldStartDrag(e) {
    const deltaX = Math.abs(e.clientX - startX);
    const deltaY = Math.abs(e.clientY - startY);
    return !isDragging && (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD);
}

/**
 * Handles the drag movement, preventing default behavior and updating drop zones.
 * @param {MouseEvent} e - The mouse move event.
 */
function handleDragMovement(e) {
    e.preventDefault(); // Verhindert Standard-Textauswahl
    moveAt(e.clientX, e.clientY);
    resetDropZones();
    highlightActiveDropZone(e);
}

/**
 * Resets all drop zones by removing active classes and adjusting placeholder opacity.
 */
function resetDropZones() {
    document.querySelectorAll('.tasks-list').forEach(list => {
        list.classList.remove('drop-zone-active');
        const placeholders = list.querySelectorAll('.placeholder');
        placeholders.forEach(p => p.style.opacity = '0.5');
    });
}

/**
 * Highlights the active drop zone based on the mouse position.
 * @param {MouseEvent} e - The mouse move event.
 */
function highlightActiveDropZone(e) {
    const elBelow = document.elementFromPoint(e.clientX, e.clientY);
    const tasksList = elBelow?.closest('.tasks-list');
    if (tasksList && tasksList.querySelector('.placeholder')) {
        tasksList.classList.add('drop-zone-active');
        const activePlaceholder = tasksList.querySelector('.placeholder');
        if (activePlaceholder) {
            activePlaceholder.style.opacity = '1';
            tasksList.appendChild(activePlaceholder);
        }
    }
}

// === Drag Lifecycle ===
/**
 * Starts the drag operation by setting styles, creating placeholders, and moving the element.
 * @param {MouseEvent} e - The mouse event that triggered the drag start.
 */
function startDrag(e) {
    disableTextSelection();
    createPlaceholdersInAdjacentZones();
    setDragStyles(e);
}

/**
 * Disables text selection on the document body.
 */
function disableTextSelection() {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
}

/**
 * Sets the styles for the dragged element and moves it.
 * @param {MouseEvent} e - The mouse event.
 */
function setDragStyles(e) {
    draggedEl.classList.add('dragging');
    draggedEl.style.position = 'fixed';
    draggedEl.style.zIndex = '1000';
    draggedEl.style.pointerEvents = 'none';
    window.dragged = draggedEl; // Set global dragged element
    document.body.appendChild(draggedEl);
    moveAt(e.clientX, e.clientY);
}

/**
 * Handles the mouse up event, completing the drag if active or allowing click events.
 * @param {MouseEvent} e - The mouse up event.
 */
function onMouseUp(e) {
    document.removeEventListener('mousemove', onMouseMove);
    if (isDragging) {
        completeDrag();
    }
    // Reset
    draggedEl = null;
    isDragging = false;
}

/**
 * Completes the drag operation by repositioning the element, cleaning up placeholders, and updating data.
 */
function completeDrag() {
    enableTextSelection();
    repositionDraggedElement();
    cleanupPlaceholders();
    updateTaskData();
}

/**
 * Re-enables text selection on the document body.
 */
function enableTextSelection() {
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.mozUserSelect = '';
    document.body.style.msUserSelect = '';
}

/**
 * Repositions the dragged element based on the active placeholder.
 */
function repositionDraggedElement() {
    const activePlaceholder = document.querySelector('.tasks-list.drop-zone-active .placeholder');
    if (activePlaceholder) {
        activePlaceholder.parentNode.insertBefore(draggedEl, activePlaceholder);
    } else {
        // Restore to original position if no active drop zone
        if (originalTasksList && originalIndex >= 0) {
            const children = Array.from(originalTasksList.children);
            if (originalIndex < children.length) {
                originalTasksList.insertBefore(draggedEl, children[originalIndex]);
            } else {
                originalTasksList.appendChild(draggedEl);
            }
        }
    }
}

/**
 * Removes all placeholders and drop zone highlights.
 */
function cleanupPlaceholders() {
    document.querySelectorAll('.placeholder').forEach(p => p.remove());
    document.querySelectorAll('.tasks-list').forEach(list => {
        list.classList.remove('drop-zone-active');
    });
}

/**
 * Resets the styles of the dragged element and updates task data.
 */
function updateTaskData() {
    draggedEl.classList.remove('dragging');
    draggedEl.style.position = '';
    draggedEl.style.left = '';
    draggedEl.style.top = '';
    draggedEl.style.zIndex = '';
    draggedEl.style.pointerEvents = '';
    window.dragged = null; // Reset global dragged state
    // Only update if repositioned to a new column
    const currentColumn = draggedEl.closest('.board-column');
    if (currentColumn && currentColumn !== originalTasksList.closest('.board-column')) {
        let newCol = currentColumn.dataset.columnIndex;
        moveTaskToCategory(
            displayedTasks[draggedEl.dataset.displayedidIndex],
            categories[newCol],
            draggedEl
        );
    }
    updateEmptyMessages();
    addDragEventsToCards();
}

// === Task Management ===
/**
 * Moves a task to a new category, updates local data, and syncs with Firebase.
 * @param {Object} taskData - The data of the task to move.
 * @param {string} newStatus - The new status/category for the task.
 * @param {HTMLElement} taskElement - The DOM element of the task.
 */
async function moveTaskToCategory(taskData, newStatus, taskElement) {
    if (!taskData) return;
    let tasksId = taskElement.dataset.tasksId;
    let displayedTasksId = taskElement.dataset.displayedTasksId;
    updateTask(taskData, newStatus);
    tasks[tasksId] = taskData;
    displayedTasks[displayedTasksId] = taskData;
    updateTaskInFirebase(taskData);
}

/**
 * Updates the status of a task by setting the new status to true and others to false.
 * @param {Object} taskData - The task data object with status properties.
 * @param {string} newStatus - The new status to set as active.
 */
function updateTask(taskData, newStatus) {
    Object.values(categories).forEach((stat) => {
        if (stat == newStatus) {
            taskData.status[stat] = true;
        } else {
            taskData.status[stat] = false;
        }
    });
}

/**
 * Updates the task data in Firebase by sending a PUT request.
 * @param {Object} taskData - The task data to update in Firebase.
 * @returns {Promise<void>} Resolves when the update is complete.
 */
async function updateTaskInFirebase(taskData) {
    try {
        let path = "/tasks/" + taskData.id + "/";
        await putData(path, taskData);
    } catch (e) {
        console.error("Put Task to Firebase:", e);
    }
}

/**
 * Updates the task data in Firebase by sending a PUT request.
 * @param {Object} taskData - The task data to update in Firebase.
 * @returns {Promise<void>} Resolves when the update is complete.
 */
async function updateTaskInFirebase(taskData) {
    try {
        let path = "/tasks/" + taskData.id + "/";
        await putData(path, taskData);
    } catch (e) {
        console.error("Put Task to Firebase:", e);
    }
}
