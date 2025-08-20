
function addTaskOverlayTemplate(){
  return`
  <div class="wrapper flex flex-column align-center w-full max-w-1200">

        <div class="main-container w-full flex flex-column max-w-1200">
            <div class="add-task-section w-full max-w-1200 p-20 flex flex-column">
               
                <form id="form-element" class="w-full flex flex-column ">
                    <div class="add-task-container w-full flex">
                        <div class="section-task-left w-full max-w-50">

                            <div class="title-task">
                                <p class="title-task font-bundle">Title<span class="star">*</span></p>
                                <label for="title-task" class="sr-only"></label>
                                <input
                                    class="input-title-task font-bundle  max-w-440 border-radius-10px input-bundle black-color"
                                    id="title-task" name="title" type="text" placeholder="Enter a title">
                                <div class="error-container" id="title-error-border">
                                    <div class="error-text d-none">This fields is required</div>
                                </div>
                            </div>

                            <div class="decription-class">
                                <p class="font-bundle description-title">Description</p>
                                <label for="description" class="sr-only"></label>
                                <textarea class="textarea-task font-bundle w-full max-w-440 border-radius-10px"
                                    name="description" id="task-description"
                                    placeholder="Enter a Description"></textarea>
                            </div>

                            <div class="date-task">
                                <p class="font-bundle w-full date">Du date <span class="star">*</span></p>
                                <label for="due-date" class="sr-only"></label>
                                <input class="font-bundle date-input-task input-bundle max-w-440 " id="task-date"
                                    name="dueDate" type="date">
                                <div class="error-container" id="date-error-border">
                                    <div id="error-info" class="error-text d-none ">This fields is required or the date
                                        in the past</div>
                                </div>
                            </div>
                        </div>

                        <div class="pipe"></div>

                        <div class="section-task-right w-full max-w-50">
                            <p class="font-bundle">Priority</p>
                            <div class="btn-prio flex justify-start max-w-440">
                                <button id="urgent" class="font-bundle btn-prio-bundle border-radius-10px">Urgent <img
                                        src="./assets/img/icons/add_task/urgent_icon.svg" alt="Urgent Icon">
                                </button>
                                <button id="medium"
                                    class="medium-btn btn-prio-bundle border-radius-10px font-bundle display-standard">
                                    Medium
                                    <img id="medium-icon" src="./assets/img/icons/add_task/prio_medium_orange.svg"
                                        alt="medium">
                                </button>

                                <button id="low" class="font-bundle btn-prio-bundle border-radius-10px">Low <img
                                        src="./assets/img/icons/add_task/low_Icon.svg" alt="Low Icon">
                                </button>
                            </div>


                            <!-- Assigned -->
                            <div class="assigned-to-container">
                                <label class="font-bundle"><p class="assigned-to">Assigned to</p></label>
                                <div class="custom-dropdown w-full" onclick="handleDropdownClick(event)">
                                    <div class="dropdown-input max-w-440 border-radius-10px input-bundle flex align-center justify-between bg-white"
                                        onclick="toggleDropdown(event)">
                                        <input class="font-bundle input-field" type="text"
                                            placeholder="Select contacts to assign" id="searchInput">
                                        <span class="arrow">&#9662;</span>
                                    </div>
                                    <div class="dropdown-list w-full bg-white" id="contactList">
                                        <div class="contact-item flex align-center justify-between border-radius-10px">
                                        </div>
                                    </div>
                                </div>
                                <div id="selectedContacts" class="contact-selected flex"></div>
                            </div>

                            <div class="category-task select-wrapper">
                                <p class="font-bundle m-top">Category<span class="star">*</span></p>

                                <div class="select-container w-full max-w-440 black-color">
                                    <select class="font-bundle input-bundle max-w-440 category-text black-color"
                                        name="category" id="task-category" onfocus="rotateCategoryArrow(true)"
                                        onblur="rotateCategoryArrow(false)">

                                        <option value="" disabled selected hidden>Select task category</option>

                                        <option value="Technical Task">Technical Task</option>
                                        <option value="User Story">User Story</option>
                                    </select>
                                    <span class="arrow p-16 " id="category-arrow">&#9662;</span>
                                </div>
                            </div>

                            <div class="subtask-container">
                                <p class="font-bundle m-top">Subtasks</p>

                                <!-- Zustand 1 -->
                                <div id="subtask-initial"
                                    class="subtask-input-box input-bundle max-w-440 black-color flex align-center justify-between bg-white"
                                    onclick="showSubtaskInput()">
                                    <input class="add-subtask-input input-bundle font-bundle" type="text"
                                        placeholder="Add new subtask" readonly>
                                    <span id="open-subtask" class="icon plus">
                                        <img src="assets/img/icons/add_task/add.svg" alt="Plus Icon">
                                    </span>
                                </div>

                                <!-- Zustand 2 -->
                                <div id="subtask-active" class="subtask-input-box input-bundle max-w-440 d-none">
                                    <input class="input-second font-bundle" type="text" id="subtask-input-second"
                                        placeholder="Add new subtask">
                                    <div class="icon-subtask-container display-standard">
                                        <span id="cancel-subtask" class="icon cancel" onclick="cancelSubtaskInput()">
                                            <img class="icon-task" src="assets/img/icons/add_task/delete.svg"
                                                alt="Cancel Icon">
                                        </span>
                                        <span id="confirm-subtask" class="icon confirm" onclick="confirmSubtaskInput()">
                                            <img class="icon-task" src="assets/img/icons/add_task/check_noir.svg"
                                                alt="Confirm Icon">
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div id="subtask-output" class="output-subtask"></div>
                        </div>
                    </div>

                    <div class="section-task-under">
                        <div class="star-required flex justify-start align-center w-full">
                            <p class="required-task-text font-bundle"><sup class="star">*</sup>This field is required
                            </p>
                        </div>
                        <div class="btn-clear-task-container display-standard w-full">
                            <button class="btn-addtask-create font-bundle w-full border-radius-10px p-16 white-color"
                                type="submit">OK<img class="icon-task" src="assets/img/icons/add_task/check.svg"
                                    alt="Ok Icon"></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  `
}

function getAssignedNameTemplate(initials, name, color) {
  return `
    <div class="contact-item" onclick="toggleCheckboxContact(this)">
      <span class="avatar display-standard white-color"
            style="background-color: ${color};">${initials}</span>
      <span class="contact-name">${name["first-name"]} ${name["last-name"]}</span>
      <input type="checkbox"
             class="contact-checkbox"
+            data-id="${name.id}"
             data-name="${name["first-name"]} ${name["last-name"]}"
             data-initials="${initials}"
             onclick="toggleCheckboxContact(this); event.stopPropagation();">
    </div>
  `;
}

function getSubtaskTemplate(text) {
  return `
 <div class="subtask-text-box flex justify-between ">
  <div class="subtask-entry font-bundle" onclick="startEditSubtask(this)">•${text}</div>
  <div class="icon-edit-subtask-box display-standard d-none">
    <img class="icon-task edit-icon" src="assets/img/icons/add_task/Property1=edit.svg" alt="Edit Icon" onclick="startEditSubtask(this)">
    <svg width="2" height="24" viewBox="0 0 2 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.14453 0V24" stroke="#A8A8A8" />
    </svg>
    <img class="icon-task delete-subtask-input" src="assets/img/icons/add_task/delete.svg" alt="Cancel Icon" onclick="deleteSubtask(this)">
    <img class="icon-task confirm-icon d-none" src="assets/img/icons/add_task/check_noir.svg" alt="Confirm Icon" onclick="finishEditSubtask(this)">
  </div>
</div>
 `;
}

function changeDivtoInputTemplate(text) {
  return `
<input class="subtask-entry font-bundle border-bottom-blue" type="text" value="${text}"
    onkeydown="if(event.key==='Enter'){ finishEditSubtask(this); }">
`;
}

function getReturnToDivTemplate(text) {
  return `
<div class="subtask-entry font-bundle" onclick="startEditSubtask(this)">
    ${text}
</div>
`;
}

function getAssignedNameTemplate(initials, name, color) {
  return `
    <div class="contact-item" onclick="toggleCheckboxContact(this)">
      <span class="avatar display-standard white-color"
            style="background-color: ${color};">${initials}</span>
      <span class="contact-name">${name["first-name"]} ${name["last-name"]}</span>
      <input type="checkbox"
             class="contact-checkbox"
             data-name="${name["first-name"]} ${name["last-name"]}"
             data-initials="${initials}"
             onclick="toggleCheckboxContact(this); event.stopPropagation();">
    </div>
  `;
}


