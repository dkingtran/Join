
nameRef = document.getElementById('name');
emailRef = document.getElementById('email');
phoneRef = document.getElementById('phone');
let nameErrorMsg = document.getElementById('name-error-msg');
let emailErrorMsg = document.getElementById('email-error-msg');
let phoneErrorMsg = document.getElementById('phone-error-msg');

const addFormButtons = document.getElementById('add-form-buttons');
const editFormButtons = document.getElementById('edit-form-buttons');
const contactFormSubtitle = document.getElementById('contact-form-subtitle');
const contactFormTitle = document.getElementById('contact-form-title');

let currentAvatarColor;
let nameIsValid;
let emailIsValid;
let phoneIsValid;
let editId;

/**
 * @function
 * Opens the contact form in either "add" or "edit" mode.
 * @param {string} [formType="add"] - The type of form to open. Can be "add" or "edit".
 * @param {string|number} [idx=""] - The index or identifier of the contact to edit (used only when formType is "edit").
 */
function openContactForm(formType = "add", idx = "") {
    showForm();
    if (formType == "add") {
        showAddForm();
    }
    if (formType == "edit") {
        showEditForm(idx);
    }
}

/**
 * @function
 * Displays the contact form modal by adding the 'show' class to the form container and overlay.
 * Also attaches an event listener to close the form when clicking outside of it.
 */
function showForm() {
    const form = document.getElementById('container-form');
    form.classList.add('show');
    const overlay = document.getElementById('overlay-modal');
    if (overlay) overlay.classList.add('show');
    document.addEventListener('click', closeFormOnOutsideClick);
}

/**
 * @function
 * Hides the contact form modal by removing the 'show' class from the form and overlay elements.
 * Also removes the outside click event listener and clears the input fields for name, email, and phone.
 */
function hideForm() {
    removeErrors();
    const form = document.getElementById('container-form');
    form.classList.remove('show');
    const overlay = document.getElementById('overlay-modal');
    if (overlay) overlay.classList.remove('show');
    document.removeEventListener('click', closeFormOnOutsideClick);
    nameRef.value = '';
    emailRef.value = '';
    phoneRef.value = '';
    setDefaultAvatar(document.getElementById('form-avatar'));
}

/**
 * @function
 * Closes the form if a click event occurs outside the form container but within the modal overlay.
 * @param {MouseEvent} e - The mouse event triggered by the user's click.
 */
function closeFormOnOutsideClick(e) {
    const formContainer = document.getElementById('container-form');
    const overlay = document.getElementById('overlay-modal');
    if (formContainer.classList.contains('show') && overlay.contains(e.target)) hideForm();
}

/**
 * @function
 * Displays the add contact form with default settings.
 * - Sets a default avatar image.
 * - Assigns a random color to the current avatar.
 * - Shows the add form buttons and hides the edit form buttons.
 * - Updates the form title and subtitle for adding a contact mode.
 */
function showAddForm() {
    currentAvatarColor = getRandomColor();
    addFormButtons.classList.remove('d-none');
    editFormButtons.classList.add('d-none');
    contactFormTitle.innerText = "Add contact";
    contactFormSubtitle.classList.remove('d-none');
}

/**
 * @function
 * Displays the edit form for a contact at the specified index.
 * Populates the form fields with the contact's current information,
 * updates the avatar color, and toggles the form buttons and titles for editing mode.
 * @param {number} idx - The index of the contact in the sortedContacts array to edit.
 */
function showEditForm(idx) {
    let contactToEdit = sortedContacts[idx];
    currentAvatarColor = contactToEdit.color;
    document.getElementById('name').value = contactToEdit.name["first-name"] + " " + contactToEdit.name["last-name"];
    document.getElementById('email').value = contactToEdit.email;
    document.getElementById('phone').value = contactToEdit["phone-number"];
    updateFormAvatar();
    addFormButtons.classList.add('d-none');
    editFormButtons.classList.remove('d-none');
    contactFormTitle.innerText = "Edit contact";
    contactFormSubtitle.classList.add('d-none');
    editId = contactToEdit.id;
}

/**
 * @function
 * Resets the avatar element by removing all color classes and setting a default avatar image.
 * @param {HTMLElement} avatar - The DOM element representing the avatar to reset.
 */
function setDefaultAvatar(avatar) {
    for (let index = 0; index <= colors.length; index++) avatar.classList.remove(colors[index]);
    avatar.innerHTML = '<img src="assets/img/icons/add-contact/person-avatar.svg" alt="Avatar">';
}

/**
 * @function
 * Updates the avatar displayed in the contact form based on the entered name.
 * If the name input is empty, sets the avatar to a default state.
 * Otherwise, sets the avatar's color and initials according to the name.
 */
function updateFormAvatar() {
    const name = document.getElementById("name").value.trim();
    const avatar = document.getElementById("form-avatar");
    if (!name) {
        setDefaultAvatar(avatar);
        return;
    }
    const colorClass = currentAvatarColor;
    avatar.classList.add(colorClass);
    avatar.textContent = getInitials(name);
}

/**
 * @function
 * Handles the submission of the contacts form by determining which button was used to submit the form
 * and invoking the corresponding action (add, edit, or delete contact).
 * @param {SubmitEvent} event - The form submission event containing information about the submitter.
 */
function submitContactsForm(event) {
    let submitterId = event.submitter.getAttribute('id');
    switch (submitterId) {
        case "create-contact-btn":
            addContact();
            break;
        case "edit-contact-btn":
            editContact();
            break;
        case "delete-contact-form-btn":
            deleteContact(editId);
            break;
    }
}

/**
 * @async
 * @function
 * Handles the process of adding a new contact.
 * Validates the contact form and checks for duplicate contacts by email.
 * If validation passes and no duplicate is found, posts the new contact,
 * reloads the contact list, and displays a confirmation modal.
 * Shows an error if validation fails or a duplicate is detected.
 */
async function addContact() {
    if (!checkContactForm()) showError();
    else if (!checkForContactDuplicate(emailRef.value)) showError();
    else {
        await postContact();
        reloadContacts();
        showContactCreatedModal();
    }
}

/**
 * @function
 * Displays the "Contact Created" modal by adding the 'show' class to the modal element.
 * The modal is automatically hidden after 2 seconds by removing the 'show' class.
 */
function showContactCreatedModal() {
    const modal = document.getElementById('modal-contact-created');
    if (!modal) return;
    modal.classList.add('show');
    setTimeout(() => {
        modal.classList.remove('show');
    }, 2000);
}

/**
 * @async
 * @function
 * Edits an existing contact after validating the contact form.
 * If the form is invalid, displays an error message.
 * If the form is valid, updates the contact and reloads the contact list.
 */
async function editContact() {
    if (!checkContactForm()) showError();
    else {
        await putContact();
        reloadContacts();
    }
}

/**
 * @function
 * Deletes a contact by its index in the sortedContacts array.
 * @param {number} idx - The index of the contact to delete in the sortedContacts array.
 */
function getIdToDelete(idx) {
    let contactId = sortedContacts[idx].id;
    deleteContact(contactId);
}

/**
 * @async
 * @function
 * Deletes a contact by its ID and reloads the contact list.
 * @param {string|number} contactId - The unique identifier of the contact to delete.
 */
async function deleteContact(contactId) {
    let path = "/contacts/" + contactId + "/";
    await deleteData(path);
    reloadContacts();
}

/**
 * @async
 * @function
 * Creates a new contact by generating contact data, posting it to the server,
 * and then adding the returned contact ID to the contact object.
 */
async function postContact() {
    let newContact = generateContact();
    let contactId = await postData("/contacts/", newContact);
    await addIdToObject(contactId, "/contacts/");
}

/**
 * @async
 * @function
 * Updates an existing contact with edited information.
 * Generates the updated contact data, assigns the current edit ID,
 * and sends a PUT request to update the contact on the server.
 */
async function putContact() {
    let editedContact = generateContact();
    editedContact["id"] = editId;
    let path = "/contacts/" + editId + "/";
    await putData(path, editedContact);
}

/**
 * @async
 * @function
 * Reloads the contact list by fetching the latest contacts, hiding the contact form,
 * clearing any selected contact highlights, hiding mobile contact details, and re-rendering the contacts.
 */
async function reloadContacts() {
    await getContactsArray();
    hideForm();
    document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('selected'));
    hideMobileContactDetails();
    renderContacts();
}

/**
 * @function
 * Validates the contact form fields by checking the name, email, and phone number.
 * @returns {boolean} Returns true if all fields are valid, otherwise false.
 */
function checkContactForm() {
    nameIsValid = nameCheck(nameRef.value);
    emailIsValid = emailCheck(emailRef.value);
    phoneIsValid = phoneNumberCheck(phoneRef.value);
    return nameIsValid && emailIsValid && phoneIsValid;
}

/**
 * @function
 * Checks if a contact with the specified email already exists in the users data.
 * @param {string} email - The email address to check for duplication.
 * @returns {Promise<boolean>} - Resolves to true if a contact with the given email exists, otherwise false.
 */
async function checkForContactDuplicate(email) {
    let contacts = await loadData("/contacts/");
    let contactKeyArray = Object.keys(contacts);
    return contactKeyArray.some(contactKey => {
        return contacts[contactKey].email == email;
    });
}

/**
 * @function
 * Generates a contact object with email, name, phone number, and color properties.
 * @returns {Object} The generated contact object.
 */
function generateContact() {
    return {
        "email": emailRef.value,
        "name": generateNameObject(nameRef.value),
        "phone-number": phoneNumberForm(phoneRef.value),
        "color": currentAvatarColor,
    };
}

/**
 * @function
 * invokes the showInputError function for each input field.
 */
function showError() {
    showInputError("name", nameIsValid);
    showInputError("email", emailIsValid);
    showInputError("phone", phoneIsValid);
}

/**
 * @function
 * Adds error class to corresponding input field if the input is not valid.
 * @param {String} inputRef - The name of the the input field.
 * @param {Boolean} isValid - A boolean for the validity of each input.
 */
function showInputError(inputRef, isValid) {
    if (!isValid) {
        switch (inputRef) {
            case "name":
                nameRef.closest('.input-wrapper').classList.add('error');
                nameErrorMsg.classList.add('show');
                break;
            case "email":
                emailRef.closest('.input-wrapper').classList.add('error');
                emailErrorMsg.classList.add('show');
                break;
            case "phone":
                phoneRef.closest('.input-wrapper').classList.add('error');
                phoneErrorMsg.classList.add('show');
                break;
        }
    }
}

/**
 * event listeners on each input field which removes the error class on input field,
 * in the corresponding input field.
 */
nameRef.addEventListener("input", () => {
    nameRef.closest('.input-wrapper').classList.remove('error');
    nameErrorMsg.classList.remove('show');
});

emailRef.addEventListener("input", () => {
    emailRef.closest('.input-wrapper').classList.remove('error');
    emailErrorMsg.classList.remove('show');
});

phoneRef.addEventListener("input", () => {
    phoneRef.closest('.input-wrapper').classList.remove('error');
    phoneErrorMsg.classList.remove('show');
});

/**
 * Removes error styling and error messages from the name, email, and phone input fields.
 * This function clears the 'error' class from the input elements and hides the associated error messages.
 */
function removeErrors() {
    nameRef.closest('.input-wrapper').classList.remove('error');
    nameErrorMsg.classList.remove('show');
    emailRef.closest('.input-wrapper').classList.remove('error');
    emailErrorMsg.classList.remove('show');
    phoneRef.closest('.input-wrapper').classList.remove('error');
    phoneErrorMsg.classList.remove('show');
}