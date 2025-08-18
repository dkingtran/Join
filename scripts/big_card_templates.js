function bigCardTemplate(id, category, title, desc, due, prio, avatarsHTML, subtasksHTML) {
  return `
    <div class="big-card-content" id="big-card-${id}">
      <div class="category-x">
       <div class="category-chois ${getCategoryClass(category)}" id="category-big-card-${id}">
  ${category || ""}
</div>
        <div class="x-closing-icon"><!-- Icon --></div>
      </div>

      <div class="title-content" id="title-big-card-${id}">${title || ""}</div>

      <div class="description-big-card" id="description-big-card-${id}">
        ${desc || ""}
      </div>

      <div class="date-big-card">
        <p class="date-big-card-text">Due date:</p>
        <span class="date-info-big-card" id="date-big-card-${id}">${due || ""}</span>
      </div>

      <div class="prio-big-card">
        Priority:
        <span id="prio-big-card-${id}">${prio ? prio.charAt(0).toUpperCase() + prio.slice(1) : ""}</span>
        ${typeof getPriorityIcon === "function" ? getPriorityIcon(prio) : ""}
      </div>

      <div class="assigned-big-card">
        Assigned to:
        <div class="contacts-big-card">
          ${avatarsHTML}
        </div>
      </div>

      <div class="subtasks-big-card">
        <p class="subtask-text-big-card">Subtasks</p>
        ${subtasksHTML}
      </div>

      <div class="delete-edit-big-card-content">
     <div class="delete-icon-big-card" onclick="deleteTaskBigCard('${id}')">
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_75601_14777" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
              <rect x="0.144531" width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_75601_14777)">
              <path d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453ZM7.14453 6V19H17.1445V6H7.14453ZM9.14453 16C9.14453 16.2833 9.24036 16.5208 9.43203 16.7125C9.6237 16.9042 9.8612 17 10.1445 17C10.4279 17 10.6654 16.9042 10.857 16.7125C11.0487 16.5208 11.1445 16.2833 11.1445 16V9C11.1445 8.71667 11.0487 8.47917 10.857 8.2875C10.6654 8.09583 10.4279 8 10.1445 8C9.8612 8 9.6237 8.09583 9.43203 8.2875C9.24036 8.47917 9.14453 8.71667 9.14453 9V16ZM13.1445 16C13.1445 16.2833 13.2404 16.5208 13.432 16.7125C13.6237 16.9042 13.8612 17 14.1445 17C14.4279 17 14.6654 16.9042 14.857 16.7125C15.0487 16.5208 15.1445 16.2833 15.1445 16V9C15.1445 8.71667 15.0487 8.47917 14.857 8.2875C14.6654 8.09583 14.4279 8 14.1445 8C13.8612 8 13.6237 8.09583 13.432 8.2875C13.2404 8.47917 13.1445 8.71667 13.1445 9V16Z" fill="#2A3647"/>
            </g>
          </svg>
          <p class="delete-text-big-card">Delete</p>
        </div>

        <svg width="2" height="24" viewBox="0 0 2 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.14453 0V24" stroke="#A8A8A8" />
        </svg>

        <div class="edit-pen-big-card" onclick="editBigCard()">
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_75592_9969" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
              <rect x="0.144531" width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_75592_9969)">
              <path d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z" fill="#2A3647"/>
            </g>
          </svg>
          <p class="edit-text big-card">Edit</p>
        </div>
      </div>
    </div>
  `;
}


function avatarItemTemplate(initials, bgColor, fullName) {
  return `
    <div class="avatar-with-name">
      <div class="avatar" style="background-color:${bgColor};">${initials}</div>
      <span class="avatar-name">${fullName}</span>
    </div>
  `;
}

function subtaskItemTemplate(taskId, subtaskId, subText, isDone) {
  return `
    <div class="checkbox-subtask-content">
      <input
        type="checkbox"
        id="subtask-${taskId}-${subtaskId}"
        data-task-id="${taskId}"
        data-subtask-id="${subtaskId}"
        onchange="toggleSubtaskDone(this)"
        ${isDone ? "checked" : ""}
      >
      <label for="subtask-${taskId}-${subtaskId}" class="subtask-value-content">${subText}</label>
    </div>
  `;
}

function addTaskOverlayTemplate(){
  return`
  <div class="wrapper flex flex-column align-center w-full max-w-1200">

        <div class="main-container w-full flex flex-column max-w-1200">
            <div class="add-task-section w-full max-w-1200 p-20 flex flex-column">
                <div class="title-section w-full max-w-1200 flex">
                    <h1>Add Task</h1>
                </div>
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
                                        src="./urgent_icon.svg" alt="Urgent Icon">
                                </button>
                                <button id="medium"
                                    class="medium-btn btn-prio-bundle border-radius-10px font-bundle display-standard">
                                    Medium
                                    <img id="medium-icon" src="./prio_medium_orange.svg"
                                        alt="medium">
                                </button>

                                <button id="low" class="font-bundle btn-prio-bundle border-radius-10px">Low <img
                                        src="./low_Icon.svg" alt="Low Icon">
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
                                        <img src="./add.svg" alt="Plus Icon">
                                    </span>
                                </div>

                                <!-- Zustand 2 -->
                                <div id="subtask-active" class="subtask-input-box input-bundle max-w-440 d-none">
                                    <input class="input-second font-bundle" type="text" id="subtask-input-second"
                                        placeholder="Add new subtask">
                                    <div class="icon-subtask-container display-standard">
                                        <span id="cancel-subtask" class="icon cancel" onclick="cancelSubtaskInput()">
                                            <img class="icon-task" src="./delete.svg"
                                                alt="Cancel Icon">
                                        </span>
                                        <span id="confirm-subtask" class="icon confirm" onclick="confirmSubtaskInput()">
                                            <img class="icon-task" src="./check_noir.svg"
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

                            <button
                                class="btn-addtask-clear font-bundle display-standard w-full border-radius-10px p-16 bg-white"
                                type="reset" onclick="resetFormState()">Clear
                                <svg class="icon-close" width="13" height="14" viewBox="0 0 13 14" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.24959 6.99984L11.4926 12.2428M1.00659 12.2428L6.24959 6.99984L1.00659 12.2428ZM11.4926 1.75684L6.24859 6.99984L11.4926 1.75684ZM6.24859 6.99984L1.00659 1.75684L6.24859 6.99984Z"
                                        stroke="#2A3647" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button class="btn-addtask-create font-bundle w-full border-radius-10px p-16 white-color"
                                type="submit">Create
                                Task<img class="icon-task" src="./check.svg"
                                    alt="Ok Icon"></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div id="task-message" class="task-message hidden">
        <div class="task-successful-info">
            <p class="task-successful-info-text">Task successfully created!</p>

            <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M22.9575 2.73855L22.9575 23.1929C22.9569 23.7955 22.7173 24.3732 22.2912 24.7993C21.8651 25.2253 21.2874 25.465 20.6848 25.4656L16.1394 25.4656C15.5368 25.465 14.9591 25.2253 14.533 24.7993C14.1069 24.3732 13.8673 23.7955 13.8667 23.1929L13.8667 2.73855C13.8673 2.13597 14.1069 1.55825 14.533 1.13217C14.9591 0.706083 15.5368 0.466443 16.1394 0.465841L20.6848 0.46584C21.2874 0.466443 21.8651 0.706082 22.2912 1.13217C22.7173 1.55825 22.9569 2.13597 22.9575 2.73855ZM16.1394 23.1929L20.6848 23.1929L20.6848 2.73855L16.1394 2.73855L16.1394 23.1929ZM16.1394 2.73855L16.1394 23.1929C16.1388 23.7955 15.8992 24.3731 15.4731 24.7992C15.047 25.2253 14.4693 25.4649 13.8667 25.4655L9.32128 25.4655C8.71871 25.4649 8.14099 25.2253 7.7149 24.7992C7.28882 24.3731 7.04918 23.7954 7.04858 23.1928L7.04858 2.73852C7.04918 2.13595 7.28882 1.55823 7.7149 1.13214C8.14099 0.706058 8.71871 0.466423 9.32128 0.46582L13.8667 0.46582C14.4693 0.466422 15.047 0.706058 15.4731 1.13214C15.8992 1.55823 16.1388 2.13597 16.1394 2.73855ZM9.32128 23.1928L13.8667 23.1929L13.8667 2.73855L9.32128 2.73852L9.32128 23.1928ZM9.32128 2.73852L9.32128 23.1928C9.32068 23.7954 9.08104 24.3731 8.65496 24.7992C8.22887 25.2253 7.65115 25.4649 7.04858 25.4656L2.50317 25.4656C1.9006 25.4649 1.32288 25.2253 0.896793 24.7992C0.470708 24.3731 0.23107 23.7954 0.230469 23.1928L0.230468 2.73852C0.231069 2.13595 0.470707 1.55823 0.896792 1.13214C1.32288 0.706058 1.9006 0.466423 2.50317 0.46582L7.04858 0.46582C7.65115 0.466423 8.22887 0.706058 8.65496 1.13214C9.08104 1.55823 9.32068 2.13595 9.32128 2.73852ZM2.50317 23.1928L7.04858 23.1928L7.04858 2.73852L2.50317 2.73852L2.50317 23.1928Z"
                    fill="white" />
                <path
                    d="M29.7756 2.7388L29.7756 23.1931C29.775 23.7957 29.5354 24.3734 29.1093 24.7995C28.6832 25.2256 28.1055 25.4652 27.5029 25.4658L22.9575 25.4658C22.3549 25.4652 21.7772 25.2256 21.3511 24.7995C20.925 24.3734 20.6854 23.7955 20.6848 23.1929L20.6848 2.73855C20.6854 2.13597 20.925 1.5585 21.3511 1.13242C21.7772 0.706334 22.3549 0.466697 22.9575 0.466094L27.5029 0.466094C28.1055 0.466696 28.6832 0.706334 29.1093 1.13242C29.5354 1.5585 29.775 2.13622 29.7756 2.7388ZM22.9575 23.1929L27.5029 23.1931L27.5029 2.7388L22.9575 2.73855L22.9575 23.1929Z"
                    fill="white" />
            </svg>

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
             data-name="${name["first-name"]} ${name["last-name"]}"
             data-initials="${initials}"
             onclick="toggleCheckboxContact(this); event.stopPropagation();">
    </div>
  `;
}
