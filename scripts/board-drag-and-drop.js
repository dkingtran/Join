const categories = [
    { key: 'to-do', id: 'open', label: 'To do', columnId: 'tasks-list-open' },
    { key: 'in-progress', id: 'inprogress', label: 'In progress', columnId: 'tasks-list-inprogress' },
    { key: 'feedback', id: 'awaitfeedback', label: 'Await feedback', columnId: 'tasks-list-awaitfeedback' },
    { key: 'done', id: 'done', label: 'Done', columnId: 'tasks-list-done' }
];

// ===================================
// BOARD RENDERING FUNCTIONS
// ===================================

function insertNoTasksArea(listElement, label) {
    // Entferne evtl. vorhandene Drag-Areas
    listElement.querySelectorAll('.drag-area').forEach(e => e.remove());

    // Erstelle und füge die "No Tasks"-Fläche ein
    const dragArea = document.createElement('div');
    dragArea.className = 'drag-area';
    dragArea.innerHTML = `<span class="no-tasks-message">No tasks ${label.toLowerCase()}</span>`;
    listElement.appendChild(dragArea);
}

function renderWithNoTasksAreas() {
    // Prüfe für jede Kategorie, ob Tasks vorhanden sind - NACH dem normalen Rendering
    categories.forEach(cat => {
        const list = document.getElementById(cat.columnId);
        if (!list) return;
        
        // Entferne ALLE alten drag-areas (auch die "No tasks" Divs)
        list.querySelectorAll('.drag-area').forEach(e => e.remove());
        
        // Prüfe ob Tasks vorhanden sind
        const taskCards = list.querySelectorAll('.board-card');
        
        // Nur wenn KEINE Tasks → füge "No tasks" Div hinzu
        if (taskCards.length === 0) {
            insertNoTasksArea(list, cat.label);
        }
    });
}