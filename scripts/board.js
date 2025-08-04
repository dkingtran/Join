// ===================================
// SEARCH FUNCTIONALITY
// ===================================

function onSearchClick() {
    const value = document.getElementById('searchInput').value;
    // Hier kann die Suchfunktionalität ergänzt werden
    alert('Suche nach: ' + value);
}

// ===================================
// DATA & CONSTANTS
// ===================================

let tasks = [{
    'id': 0,
    'title': 'Putzen',
    'category': 'open'
}, {
    'id': 1,
    'title': 'Kochen',
    'category': 'open'
}, {
    'id': 2,
    'title': 'Einkaufen',
    'category': 'done'
}];

let currentDragged = { id: null, from: null };

const categories = [
    { key: 'open', id: 'open', label: 'To do' },
    { key: 'inprogress', id: 'inprogress', label: 'In Progress' },
    { key: 'awaitfeedback', id: 'awaitfeedback', label: 'Await Feedback' },
    { key: 'done', id: 'done', label: 'Done' }
];

// ===================================
// BOARD RENDERING FUNCTIONS
// ===================================

function updateHTML() {
    categories.forEach((cat, idx) => {
        const items = tasks.filter(t => t['category'] === cat.key);
        const list = document.getElementById('tasks-list-' + cat.key);
        const col = document.getElementById(cat.id);
        
        // Drag-area verwalten
        manageDragArea(col, cat, items.length === 0);
        
        // Tasks in tasks-list rendern
        renderTasksList(list, items, cat, idx);
    });
}

function manageDragArea(col, cat, showDragArea) {
    if (!col) return;
    
    // Entferne alle drag-areas
    col.querySelectorAll('.drag-area').forEach(e => e.remove());
    
    // Füge drag-area nur hinzu wenn keine Tasks vorhanden
    if (showDragArea) {
        const dragArea = document.createElement('div');
        dragArea.className = 'drag-area';
        dragArea.id = 'drag-area-' + cat.key;
        dragArea.ondrop = ev => handleDrop(ev, cat.key);
        dragArea.ondragover = ev => allowDrop(ev);
        dragArea.ondragleave = () => removeHighlight(cat.key);
        
        const span = document.createElement('span');
        span.className = 'no-tasks-message';
        span.textContent = `No Tasks ${cat.label}`;
        dragArea.appendChild(span);
        
        const list = document.getElementById('tasks-list-' + cat.key);
        col.insertBefore(dragArea, list);
    }
}

function renderTasksList(list, items, cat, catIdx) {
    if (!list) return;
    
    list.innerHTML = '';
    items.forEach((task, taskIdx) => {
        const taskCard = createTaskCard(task, cat, catIdx, taskIdx);
        list.appendChild(taskCard);
    });
    
    list.style.display = items.length === 0 ? 'none' : 'flex';
}

function createTaskCard(task, cat, catIdx, taskIdx) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.draggable = true;
    div.id = 'task-' + task.id;
    div.textContent = task.title;
    
    div.ondragstart = ev => startDragging(ev, task.id);
    div.ondragover = ev => handleTaskDragOver(ev, cat.key, taskIdx);
    div.ondrop = ev => handleTaskDrop(ev, cat.key, taskIdx);
    
    return div;
}

// ===================================
// DRAG & DROP FUNCTIONS
// ===================================

function startDragging(ev, id) {
    const task = tasks.find(t => t.id === id);
    currentDragged = { id: id, from: task ? task.category : null };
    ev.dataTransfer.effectAllowed = 'move';
    
    // Erstelle Vorschau-Elemente für erlaubte Bereiche
    createDropPreviews();
}

function createDropPreviews() {
    // Entferne alte Vorschauen
    document.querySelectorAll('.drop-preview').forEach(e => e.remove());
    
    const draggedTask = tasks.find(t => t.id === currentDragged.id);
    if (!draggedTask) return;
    
    const allowedCategories = getAllowedCategories(draggedTask.category);
    
    allowedCategories.forEach(cat => {
        const list = document.getElementById('tasks-list-' + cat);
        if (list) {
            const preview = document.createElement('div');
            preview.className = 'drop-preview';
            preview.innerHTML = '<span>Drop here</span>';
            list.appendChild(preview);
        }
    });
}

function getAllowedCategories(currentCategory) {
    const catIndex = categories.findIndex(c => c.key === currentCategory);
    const allowed = [];
    
    // Vorherige Kategorie
    if (catIndex > 0) {
        allowed.push(categories[catIndex - 1].key);
    }
    
    // Nächste Kategorie
    if (catIndex < categories.length - 1) {
        allowed.push(categories[catIndex + 1].key);
    }
    
    return allowed;
}

function handleTaskDragOver(ev, category, taskIndex) {
    ev.preventDefault();
    const draggedTask = tasks.find(t => t.id === currentDragged.id);
    
    if (draggedTask && getAllowedCategories(draggedTask.category).includes(category)) {
        ev.dataTransfer.dropEffect = 'move';
        
        // Erstelle Einfüge-Vorschau zwischen Tasks
        showInsertPreview(category, taskIndex);
    }
}

function showInsertPreview(category, beforeIndex) {
    // Entferne alte Insert-Previews
    document.querySelectorAll('.insert-preview').forEach(e => e.remove());
    
    const list = document.getElementById('tasks-list-' + category);
    if (!list) return;
    
    const preview = document.createElement('div');
    preview.className = 'insert-preview';
    
    const tasks = list.querySelectorAll('.task-card');
    if (beforeIndex < tasks.length) {
        list.insertBefore(preview, tasks[beforeIndex]);
    } else {
        list.appendChild(preview);
    }
}

function handleTaskDrop(ev, category, taskIndex) {
    ev.preventDefault();
    ev.stopPropagation();
    
    const draggedTask = tasks.find(t => t.id === currentDragged.id);
    if (!draggedTask) return;
    
    const allowedCategories = getAllowedCategories(draggedTask.category);
    
    if (allowedCategories.includes(category)) {
        // Task in neue Kategorie verschieben
        draggedTask.category = category;
        
        // Cleanup
        cleanupDragElements();
        updateHTML();
    }
}

function handleDrop(ev, category) {
    ev.preventDefault();
    const draggedTask = tasks.find(t => t.id === currentDragged.id);
    
    if (draggedTask && getAllowedCategories(draggedTask.category).includes(category)) {
        draggedTask.category = category;
        cleanupDragElements();
        updateHTML();
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function highlight(id) {
    const element = document.getElementById('drag-area-' + id);
    if (element) {
        element.classList.add('drag-area-highlight');
    }
}

function removeHighlight(id) {
    const element = document.getElementById('drag-area-' + id);
    if (element) {
        element.classList.remove('drag-area-highlight');
    }
}

function cleanupDragElements() {
    document.querySelectorAll('.drop-preview, .insert-preview').forEach(e => e.remove());
    document.querySelectorAll('.drag-area-highlight').forEach(e => {
        e.classList.remove('drag-area-highlight');
    });
    currentDragged = { id: null, from: null };
}

// ===================================
// FIREBASE FUNCTIONS
// ===================================

async function loadTasksFromFirebase() {
    try {
        const response = await fetch('https://join-f4dc9-default-rtdb.europe-west1.firebasedatabase.app/tasks.json');
        const data = await response.json();
        
        if (data) {
            tasks = Object.keys(data).map((key, index) => ({
                id: index,
                title: data[key].title || 'Untitled',
                category: data[key].category || 'open'
            }));
        }
        
        updateHTML();
    } catch (error) {
        console.error('Error loading tasks from Firebase:', error);
    }
}

async function saveTasksToFirebase() {
    try {
        const response = await fetch('https://join-f4dc9-default-rtdb.europe-west1.firebasedatabase.app/tasks.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tasks)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save tasks');
        }
    } catch (error) {
        console.error('Error saving tasks to Firebase:', error);
    }
}

// ===================================
// UI INTERACTION FUNCTIONS
// ===================================

function toggleHelpDropdown() {
    const dropdown = document.getElementById('helpDropdown');
    dropdown.classList.toggle('show');
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

// ===================================
// MODAL FUNCTIONS
// ===================================

function showAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    const inner = document.getElementById('addTaskModalInner');
    modal.style.display = 'flex';
    // Lade add_task.html und extrahiere NUR den .wrapper Inhalt
    fetch('add_task.html')
        .then(response => response.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            const wrapper = temp.querySelector('.wrapper');
            inner.innerHTML = wrapper ? wrapper.outerHTML : '';
            // Lade ggf. JS nach
            const script = document.createElement('script');
            script.src = './scripts/add_task.js';
            document.body.appendChild(script);
        });
    document.body.style.overflow = 'hidden';
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'none';
    document.getElementById('addTaskModalInner').innerHTML = '';
    document.body.style.overflow = '';
}

function showAddTask() {
    showAddTaskModal();
}

function addBoardTask(param) {
    showAddTaskModal();
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}
