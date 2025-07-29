function getSubtaskTemplate(text){
    return  `
   <div class="subtask-text-box">
    <li class="subtask-entry font-bundle">${text}</li>
    <div class="icon-edit-subtask-box d-none">
        <img class="icon-task" src="assets/img/icons/add_task/Property1=edit.svg" alt="Edit Icon">
        <img class="icon-task" src="assets/img/icons/add_task/delete.svg" alt="Cancel Icon" onclick="deleteSubtask(this)">
    </div>
</div>
 `;
}