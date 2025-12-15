/**
 * Returns the HTML template for rendering a big task card with all details.
 * @param {string} id - Unique task ID.
 * @param {string} category - Task category name.
 * @param {string} title - Task title.
 * @param {string} desc - Task description.
 * @param {string} due - Due date string.
 * @param {string} prio - Priority level.
 * @param {string} avatarsHTML - Pre-rendered HTML for assigned avatars.
 * @param {string} subtasksHTML - Pre-rendered HTML for subtasks list.
 * @param {boolean} isAiGenerated - Whether the task is AI generated.
 * @param {string} creatorHTML - HTML for the creator line.
 * @returns {string} Full HTML for the big card.
 */
function bigCardTemplate(id, category, title, desc, due, prio, avatarsHTML, subtasksHTML, isAiGenerated, creatorHTML) {
  return `
<div class="big-card-content w-full" id="big-card-${id}">
    <div class="category-x flex align-center justify-between w-full">
        <div class="creator-line flex align-center gap-10">
            <div class="category-chois white-color display-standard ${getCategoryClass(category)}"
                id="category-big-card-${id}">
                ${category || ""}
            </div>
            ${isAiGenerated ? `<div class="ai-label-big"><img src="./assets/img/icons/board/wand_stars.png" class="ai-icon"> AI-generated ticket</div>` : ""}
        </div>

        <div class="x-closing-icon flex" onclick="closeBigCard()">
            <svg class="icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18M6 18L18 6" stroke="#2A3647" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>

    </div>

    <div class="title-content w-full" id="title-big-card-${id}">${title || ""}</div>

    <div class="description-big-card w-full font-size-20 font-weight 400" id="description-big-card-${id}">
        ${desc || ""}
    </div>

    ${creatorHTML || ""}

    <div class="date-big-card w-full flex align-center font-size-20">
        <p class="date-big-card-text font-weight-400">Due date:</p>
        <span class="date-info-big-card font-size-20" id="date-big-card-${id}">${due || ""}</span>
    </div>

    <div class="prio-big-card flex align-center font-size-20 w-full font-weight-400">
        <p class="subtitles-prio-big-card font-size-20 font-weight-400">Priority:</p>
        <span id="prio-big-card-${id}">${prio ? prio.charAt(0).toUpperCase() + prio.slice(1) : ""}</span>
        ${typeof getPriorityIcon === "function" ? getPriorityIcon(prio) : ""}
    </div>

    <p class="subtitles-assigned-big-card font-size-20">Assigned to:</p>
    <div class="assigned-big-card font-size-20 w-full font-weight-400">
        <div class="contacts-big-card">
            ${avatarsHTML}
        </div>
    </div>

    <div class="subtasks-big-card flex">
        <p class="subtask-text-big-card font-size-20" font-weight-400>Subtasks</p>
        <div class="subtasks-list-container">
            ${subtasksHTML}
        </div>
    </div>

    <div class="delete-edit-big-card-content flex -w-full bg-white">
        <div class="delete-icon-big-card flex align-center" onclick="deleteTaskBigCard('${id}')">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_75601_14777" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25"
                    height="24">
                    <rect x="0.144531" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_75601_14777)">
                    <path
                        d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453ZM7.14453 6V19H17.1445V6H7.14453ZM9.14453 16C9.14453 16.2833 9.24036 16.5208 9.43203 16.7125C9.6237 16.9042 9.8612 17 10.1445 17C10.4279 17 10.6654 16.9042 10.857 16.7125C11.0487 16.5208 11.1445 16.2833 11.1445 16V9C11.1445 8.71667 11.0487 8.47917 10.857 8.2875C10.6654 8.09583 10.4279 8 10.1445 8C9.8612 8 9.6237 8.09583 9.43203 8.2875C9.24036 8.47917 9.14453 8.71667 9.14453 9V16ZM13.1445 16C13.1445 16.2833 13.2404 16.5208 13.432 16.7125C13.6237 16.9042 13.8612 17 14.1445 17C14.4279 17 14.6654 16.9042 14.857 16.7125C15.0487 16.5208 15.1445 16.2833 15.1445 16V9C15.1445 8.71667 15.0487 8.47917 14.857 8.2875C14.6654 8.09583 14.4279 8 14.1445 8C13.8612 8 13.6237 8.09583 13.432 8.2875C13.2404 8.47917 13.1445 8.71667 13.1445 9V16Z"
                        fill="#2A3647" />
                </g>
            </svg>
            <p class="delete-text-big-card">Delete</p>
        </div>

        <svg width="2" height="24" viewBox="0 0 2 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.14453 0V24" stroke="#A8A8A8" />
        </svg>

        <div class="edit-pen-big-card flex align-center" onclick="openEditCardFor('${id}')">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_75592_9969" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25"
                    height="24">
                    <rect x="0.144531" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_75592_9969)">
                    <path
                        d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z"
                        fill="#2A3647" />
                </g>
            </svg>
            <p class="edit-text big-card">Edit</p>
        </div>

    </div>
</div>
`;
}

/**
 * Returns the HTML template for an avatar with initials and name.
 * @param {string} initials - The user’s initials to display inside the avatar.
 * @param {string} bgColor - The background color of the avatar circle.
 * @param {string} fullName - The full name shown next to the avatar.
 * @returns {string} HTML string for the avatar item.
 */
function avatarItemTemplate(initials, bgColor, fullName) {
  return `
    <div class="avatar-with-name flex align-center">
      <div 
        class="avatar white-color display-standard" 
        style="background-color:${bgColor};"
      >
        ${initials}
      </div>
      <span class="avatar-name">${fullName}</span>
    </div>
  `;
}

/**
 * Returns the HTML template for a subtask checkbox item inside a big card.
 * @param {string} taskId - The ID of the parent task.
 * @param {string} subtaskId - The unique ID of the subtask.
 * @param {string} subText - The text content of the subtask.
 * @param {boolean} isDone - Whether the subtask is marked as completed.
 * @returns {string} HTML string for the subtask item with checkbox.
 */
function subtaskItemTemplate(taskId, subtaskId, subText, isDone) {
  const cleanText = subText.replace(/^•\s*/, "");
  return `
    <div class="checkbox-subtask-content flex align-center w-full">
      <input 
        class="input-subtask-checkbox-big-card" 
        type="checkbox" 
        id="subtask-${taskId}-${subtaskId}"
        data-task-id="${taskId}" 
        data-subtask-id="${subtaskId}" 
        onchange="toggleSubtaskDone(this)" 
        ${isDone ? "checked" : ""}
      >
      <label 
        for="subtask-${taskId}-${subtaskId}" 
        class="subtask-value-content"
      >
        ${cleanText}
      </label>
    </div>
  `;
}
