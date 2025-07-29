function getSubtaskTemplate(text){
    return  `
   <div class="subtask-text-box">
    <div class="subtask-entry font-bundle">${text}</div>
    <div class="icon-edit-subtask-box">
        <img class="icon-task" src="assets/img/icons/add_task/Property1=edit.svg" alt="Edit Icon">
        <img class="icon-task" src="assets/img/icons/add_task/delete.svg" alt="Cancel Icon" onclick="cancelSubtaskInput()">
    </div>
</div>
 `;
}