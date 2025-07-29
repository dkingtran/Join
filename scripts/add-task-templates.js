function getSubtaskTemplate(text){
    return  `
  <div class="subtask-text-box">
    <li class="subtask-entry font-bundle">${text}</li>
    <div class="icon-edit-subtask-box display-standard d-none">
        <img class="icon-task" src="assets/img/icons/add_task/Property1=edit.svg" alt="Edit Icon">
        <svg width="2" height="24" viewBox="0 0 2 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.14453 0V24" stroke="#A8A8A8" />
        </svg>
        <img class="icon-task delete-subtask-input" src="assets/img/icons/add_task/delete.svg" alt="Cancel Icon"
            onclick="deleteSubtask(this)">
    </div>
</div>
 `;
}