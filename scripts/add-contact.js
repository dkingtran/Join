let currentAvatarColor;

nameRef = document.getElementById('contactName');
emailRef = document.getElementById('contactEmail');
phoneRef = document.getElementById('contactPhone');

/**
 * Shows the add contact form and its modal overlay.
 */
function showForm() {
    const form = document.getElementById('formContainer');
    form.classList.add('show');
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.add('show');
    setDefaultAvatar(document.getElementById('formAvatar'));
    document.addEventListener('click', closeFormOnOutsideClick);
}

function hideForm() {
    const form = document.getElementById('formContainer');
    form.classList.remove('show');
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('show');
    document.removeEventListener('click', closeFormOnOutsideClick);
}


function closeFormOnOutsideClick(e) {
    const formContainer = document.getElementById('formContainer');
    const overlay = document.getElementById('modalOverlay');

    if (formContainer.classList.contains('show') && overlay.contains(e.target)) hideForm();
}

/**
 * Adds a new contact to the contacts array and updates the contact list.
 */
function addToContacts() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    if (!name || !email || !phone) return;
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');
    const fullName = `${firstName} ${lastName}`.trim();
    assignColorToContact(fullName);
    contacts.push({ firstName, lastName, email, phone });
    clearFormAndUpdate();
}

function clearFormAndUpdate() {
    ['contactName', 'contactEmail', 'contactPhone'].forEach(id => document.getElementById(id).value = '');
    setDefaultAvatar(document.getElementById('formAvatar'));
    renderContacts();
    hideForm();
    showContactCreatedModal();
}

function showContactCreatedModal() {
    const modal = document.getElementById('contactCreatedModal');
    if (!modal) return;
    modal.classList.add('show');
    setTimeout(() => {
        modal.classList.remove('show');
    }, 2000);
}

function resetAvatarColors(avatar) {
    for (let index = 0; index <= colors.length; index++) avatar.classList.remove(colors[index]);
}

function setDefaultAvatar(avatar) {
    for (let index = 0; index <= colors.length; index++) avatar.classList.remove(colors[index]);
    avatar.innerHTML = '<img src="assets/img/icons/add-contact/person-avatar.svg" alt="Avatar">';
}

function cancelForm() {
    ['contactName', 'contactEmail', 'contactPhone'].forEach(id => document.getElementById(id).value = '');
    hideForm();
}


/**
 * Opens the edit contact modal and fills in the contact data.
 * @param {number} idx - Index of the contact to edit.
 */
function editContact(sortedIdx) {
    const sorted = getSortedContacts();
    const contact = sorted[sortedIdx];
    const originalIdx = contacts.findIndex(c =>
        c.firstName === contact.firstName && c.lastName === contact.lastName &&
        c.email === contact.email && c.phone === contact.phone
    );
    if (originalIdx !== -1) showEditForm(originalIdx);
}

function showEditForm(idx) {
    const contact = contacts[idx];
    document.getElementById('editContactName').value = contact.name["first-name"] + " " + contact.name["last-name"];
    document.getElementById('editContactEmail').value = contact.email;
    document.getElementById('editContactPhone').value = contact.phone;
    updateEditFormAvatar();
    showEditModal();
    hideForm();
    setTimeout(() => document.addEventListener('click', closeEditFormOnOutsideClick), 0);
    window.editContactIdx = idx;
}

function showEditModal() {
    document.getElementById('editFormContainer').classList.add('show');
    const overlay = document.getElementById('editModalOverlay');
    if (overlay) overlay.classList.add('show');
}


function hideEditForm() {
    document.getElementById('editFormContainer').classList.remove('show');
    const overlay = document.getElementById('editModalOverlay');
    if (overlay) overlay.classList.remove('show');
    document.removeEventListener('click', closeEditFormOnOutsideClick);
}


/**
 * Closes the edit contact modal if clicking outside the edit form container.
 * @param {MouseEvent} e - The click event.
 */
function closeEditFormOnOutsideClick(e) {
    const editFormContainer = document.getElementById('editFormContainer');
    if (editFormContainer.classList.contains('show') && !editFormContainer.contains(e.target)) hideEditForm();
}

function updateEditFormAvatar() {
    const name = document.getElementById('editContactName').value.trim();
    const avatar = document.getElementById('editFormAvatar');
    resetAvatarColors(avatar);
    if (!name) {
        avatar.classList.add('contact-avatar-color10');
        avatar.innerHTML = '<img src="assets/img/icons/add-contact/person-avatar.svg" alt="Avatar">';
        return;
    }
    avatar.classList.add(colorMap[name] || 'contact-avatar-color10');
    avatar.textContent = getInitials(name);
}

function openContactForm(formType = "add", idx = "") {
    showForm2();
    let addFormButtons = document.getElementById('add-form-buttons');
    let editFormButtons = document.getElementById('edit-form-buttons');
    if (formType == "add") {
        setDefaultAvatar(document.getElementById('formAvatar'));
        currentAvatarColor = getRandomColor();
        addFormButtons.classList.remove('d-none');
        editFormButtons.classList.add('d-none');
    }
    if (formType == "edit") {
        let contactToEdit = sortedContacts[idx];
        currentAvatarColor = contactToEdit.color;
        updateEditFormAvatar();
        addFormButtons.classList.add('d-none');
        editFormButtons.classList.remove('d-none');
    }
}

function showForm2() {
    const form = document.getElementById('formContainer');
    form.classList.add('show');
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.add('show');
}

function updateFormAvatar() {
    const name = document.getElementById("name").value.trim();
    const avatar = document.getElementById("formAvatar");
    if (!name) {
        setDefaultAvatar(avatar);
        return;
    }
    const colorClass = currentAvatarColor;
    avatar.classList.add(colorClass);
    avatar.textContent = getInitials(name);
}