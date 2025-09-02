let draggedEl = null;
let placeholder = null;
let offsetX = 0, offsetY = 0;
let isDragging = false;
let startX = 0, startY = 0;
const DRAG_THRESHOLD = 10; // Minimum pixels to move before considering it a drag

// Global variable for other scripts to check drag state
window.dragged = null;

// ===================================
// BOARD RENDERING FUNCTIONS
// ===================================

function updateEmptyMessages() {
    document.querySelectorAll(".tasks-list").forEach((list) => {
        const tasks = Array.from(list.children).filter((c) =>
            c.classList.contains("board-card")
        );
        let msg = list.querySelector(".empty-msg");
        if (tasks.length === 0) {
            if (!msg) {
                let header = list.parentElement.querySelector(".column-header");
                let headerText = (header ? header.textContent : "");
                list.innerHTML = getKanbanEmptyMessage(headerText);
            } else msg.style.display = '';
        } else {
            if (msg) msg.remove();
        }
    });
}

function renderWithNoTasksAreas() {
    updateEmptyMessages();
    addDragEventsToCards();
}

// ===================================
// Drag & Drop
// ===================================

function addDragEventsToCards() {
    document.querySelectorAll('.board-card').forEach(card => {
        // Nur einmal anhängen
        if (!card.dataset.dragEventsAttached) {
            card.addEventListener('mousedown', onMouseDown);
            card.dataset.dragEventsAttached = "true";
        }
    });
}

function onMouseDown(e) {
    draggedEl = e.target.closest('.board-card');
    if (!draggedEl) return;

    // Record start position
    startX = e.clientX;
    startY = e.clientY;
    isDragging = false;
    window.dragged = null; // Reset dragged state

    const rect = draggedEl.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp, { once: true });
}

function createPlaceholdersInAdjacentZones() {
    const currentColumn = draggedEl.closest('.board-column');
    const currentColumnIndex = parseInt(currentColumn.dataset.columnIndex);

    document.querySelectorAll('.board-column').forEach((column, index) => {
        const columnIndex = parseInt(column.dataset.columnIndex);

        // Nur in der aktuellen Spalte und den benachbarten Spalten Platzhalter erstellen
        if (Math.abs(columnIndex - currentColumnIndex) <= 1) {
            const tasksList = column.querySelector('.tasks-list');
            if (tasksList) {
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.style.opacity = '0.9';

                // Platzhalter am Ende jeder erlaubten Liste hinzufügen
                tasksList.appendChild(placeholder);
            }
        }
    });
}

function moveAt(pageX, pageY) {
    draggedEl.style.left = pageX - offsetX + 'px';
    draggedEl.style.top = pageY - offsetY + 'px';
}

function onMouseMove(e) {
    if (!draggedEl) return;

    // Check if movement exceeds threshold
    const deltaX = Math.abs(e.clientX - startX);
    const deltaY = Math.abs(e.clientY - startY);

    if (!isDragging && (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD)) {
        // Start drag operation
        isDragging = true;
        startDrag(e);
    }

    if (isDragging) {
        e.preventDefault(); // Verhindert Standard-Textauswahl
        moveAt(e.pageX, e.pageY);

        // Alle Drop-Zonen zurücksetzen
        document.querySelectorAll('.tasks-list').forEach(list => {
            list.classList.remove('drop-zone-active');
            const placeholders = list.querySelectorAll('.placeholder');
            placeholders.forEach(p => p.style.opacity = '0.5');
        });

        const elBelow = document.elementFromPoint(e.clientX, e.clientY);
        const tasksList = elBelow?.closest('.tasks-list');

        // Prüfen ob die Drop-Zone erlaubt ist (hat einen Platzhalter)
        if (tasksList && tasksList.querySelector('.placeholder')) {
            // Aktive Drop-Zone hervorheben
            tasksList.classList.add('drop-zone-active');

            const activePlaceholder = tasksList.querySelector('.placeholder');
            if (activePlaceholder) {
                activePlaceholder.style.opacity = '1';

                // Platzhalter immer am Ende der Drop-Zone platzieren
                tasksList.appendChild(activePlaceholder);
            }
        }
    }
}

function startDrag(e) {
    // Text-Auswahl für das gesamte Dokument deaktivieren
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    // Platzhalter nur in benachbarten Drop-Zonen anlegen
    createPlaceholdersInAdjacentZones();

    // Karte absolut verschieben
    draggedEl.classList.add('dragging');
    draggedEl.style.position = 'fixed';
    draggedEl.style.zIndex = '1000';
    draggedEl.style.pointerEvents = 'none';
    window.dragged = draggedEl; // Set global dragged element
    document.body.appendChild(draggedEl);
    moveAt(e.pageX, e.pageY);
}

function onMouseUp(e) {
    document.removeEventListener('mousemove', onMouseMove);

    if (isDragging) {
        // Complete drag operation
        completeDrag();
    } else {
        // Allow click event to proceed
        // The click will happen naturally since we didn't prevent it
    }

    // Reset
    draggedEl = null;
    isDragging = false;
}

function completeDrag() {
    // Text-Auswahl wieder aktivieren
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.mozUserSelect = '';
    document.body.style.msUserSelect = '';

    // Finde den aktiven Platzhalter
    const activePlaceholder = document.querySelector('.tasks-list.drop-zone-active .placeholder');

    if (activePlaceholder) {
        // Karte an aktiver Platzhalter-Position einfügen
        activePlaceholder.parentNode.insertBefore(draggedEl, activePlaceholder);
    }

    // Alle Platzhalter entfernen
    document.querySelectorAll('.placeholder').forEach(p => p.remove());

    // Drop-Zone Hervorhebungen entfernen
    document.querySelectorAll('.tasks-list').forEach(list => {
        list.classList.remove('drop-zone-active');
    });

    // Reset Styles
    draggedEl.classList.remove('dragging');
    draggedEl.style.position = '';
    draggedEl.style.left = '';
    draggedEl.style.top = '';
    draggedEl.style.zIndex = '';
    draggedEl.style.pointerEvents = '';

    window.dragged = null; // Reset global dragged state

    // Firebase Update
    let newCol = draggedEl.closest('.board-column').dataset.columnIndex;
    moveTaskToCategory(
        displayedTasks[draggedEl.dataset.displayedidIndex],
        categories[newCol],
        draggedEl
    );

    updateEmptyMessages();
    addDragEventsToCards();
}

async function moveTaskToCategory(taskData, newStatus, taskElement) {
    if (!taskData) return;
    let tasksId = taskElement.dataset.tasksId;
    let displayedTasksId = taskElement.dataset.displayedTasksId;
    updateTask(taskData, newStatus);
    tasks[tasksId] = taskData;
    displayedTasks[displayedTasksId] = taskData;
    updateTaskInFirebase(taskData);
}

function updateTask(taskData, newStatus) {
    Object.values(categories).forEach((stat) => {
        if (stat == newStatus) {
            taskData.status[stat] = true;
        } else {
            taskData.status[stat] = false;
        }
    });
}

async function updateTaskInFirebase(taskData) {
    try {
        let path = "/tasks/" + taskData.id + "/";
        await putData(path, taskData);
    } catch (e) {
        console.error("Put Task to Firebase:", e);
    }
    if (stat == newStatus) {
        taskData.status[stat] = true;
    } else {
        taskData.status[stat] = false;
    }
};


async function updateTaskInFirebase(taskData) {
    try {
        let path = "/tasks/" + taskData.id + "/";
        await putData(path, taskData);
    } catch (e) {
        console.error("Put Task to Firebase:", e);
    }
}
