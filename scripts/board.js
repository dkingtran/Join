function onSearchClick() {
    const value = document.getElementById('searchInput').value;
    // Hier kann die Suchfunktionalität ergänzt werden
    alert('Suche nach: ' + value);
}
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

let currentDraggedElement;

function updateHTML() {
    // Kategorien: open, inprogress, awaitfeedback, done
    const categories = [
        { key: 'open', id: 'open', label: 'To do' },
        { key: 'inprogress', id: 'inprogress', label: 'In Progress' },
        { key: 'awaitfeedback', id: 'awaitfeedback', label: 'Await Feedback' },
        { key: 'done', id: 'done', label: 'Done' }
    ];
    categories.forEach(cat => {
        const items = tasks.filter(t => t['category'] === cat.key);
        const columnElement = document.getElementById(cat.id);
        if (columnElement) {
            // Entferne alte Tasks
            columnElement.querySelectorAll('.task-card').forEach(e => e.remove());
            // Füge neue Tasks als HTML-String ein
            const tasksHTML = items.map(generateTasksHTML).join('');
            columnElement.insertAdjacentHTML('beforeend', tasksHTML);

            // Zeige/hide die drag-area je nach Tasks
            const dragArea = columnElement.querySelector('.drag-area');
            if (dragArea) {
                dragArea.style.display = items.length === 0 ? 'flex' : 'none';
            }
        }
    });
}

// Hilfsfunktion: HTML-String zu Element
function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTasksHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="task-card">${element['title']}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    const task = tasks[currentDraggedElement];
    if (task) {
        task.category = category;

        // 🆕 Reihenfolge neu zuordnen
        tasks.splice(currentDraggedElement, 1);
        tasks.push(task);

        // IDs neu vergeben
        tasks.forEach((t, idx) => t.id = idx);
        updateHTML();
    }
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

function toggleHelpDropdown() {
    const dropdown = document.getElementById('helpDropdown');
    dropdown.classList.toggle('show');
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}
    
// Öffnet das Add Task Modal und lädt das Formular aus add_task.html
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


// Für beide Buttons das Modal öffnen (globale Funktionen für Inline-Handler)
function showAddTask() {
    showAddTaskModal();
}

function addBoardTask(param) {
    showAddTaskModal();
}
