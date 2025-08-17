function showAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').classList.remove('show');
    document.body.style.overflow = '';
}

function showAddTask() {
    showAddTaskModal();
}

function addBoardTask(param) {
    showAddTaskModal();
}
