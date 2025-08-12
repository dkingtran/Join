
nameRef = document.getElementById('name');
emailRef = document.getElementById('email');
phoneRef = document.getElementById('phone');

const addFormButtons = document.getElementById('add-form-buttons');
const editFormButtons = document.getElementById('edit-form-buttons');
const contactFormSubtitle = document.getElementById('contact-form-subtitle');
const contactFormTitle = document.getElementById('contact-form-title');

let currentAvatarColor;
let nameIsValid;
let emailIsValid;
let phoneIsValid;
let editId;

function openContactForm(formType = "add", idx = "") {
    showForm();
    if (formType == "add") {
        showAddForm();
    }
    if (formType == "edit") {
        showEditForm(idx);
    }
}

function showForm() {
    const form = document.getElementById('formContainer');
    form.classList.add('show');
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.add('show');
    document.addEventListener('click', closeFormOnOutsideClick);
}

function hideForm() {
    const form = document.getElementById('formContainer');
    form.classList.remove('show');
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('show');
    document.removeEventListener('click', closeFormOnOutsideClick);
    nameRef.value = '';
    emailRef.value = '';
    phoneRef.value = '';
}

function closeFormOnOutsideClick(e) {
    const formContainer = document.getElementById('formContainer');
    const overlay = document.getElementById('modalOverlay');
    if (formContainer.classList.contains('show') && overlay.contains(e.target)) hideForm();
}

function showAddForm() {
    setDefaultAvatar(document.getElementById('formAvatar'));
    currentAvatarColor = getRandomColor();
    addFormButtons.classList.remove('d-none');
    editFormButtons.classList.add('d-none');
    contactFormTitle.innerText = "Add contact";
    contactFormSubtitle.classList.remove('d-none');
}

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

function setDefaultAvatar(avatar) {
    for (let index = 0; index <= colors.length; index++) avatar.classList.remove(colors[index]);
    avatar.innerHTML = '<img src="assets/img/icons/add-contact/person-avatar.svg" alt="Avatar">';
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

async function addContact() {
    if (!checkContactForm()) showError();
    else if (!checkForContactDuplicate(emailRef.value)) showError();
    else {
        await postContact();
        reloadContacts();
        showContactCreatedModal();
    }
}

function showContactCreatedModal() {
    const modal = document.getElementById('contactCreatedModal');
    if (!modal) return;
    modal.classList.add('show');
    setTimeout(() => {
        modal.classList.remove('show');
    }, 2000);
}

async function editContact() {
    if (!checkContactForm()) showError();
    else {
        await putContact();
        reloadContacts();
    }
}

function getIdToDelete(idx) {
    let contactId = sortedContacts[idx].id;
    deleteContact(contactId);
}

async function deleteContact(contactId) {
    let path = "/contacts/" + contactId + "/";
    await deleteData(path);
    reloadContacts();
}

async function postContact() {
    let newContact = generateContact();
    let contactId = await postData("/contacts/", newContact);
    await addIdToObject(contactId, "/contacts/");
}

async function putContact() {
    let editedContact = generateContact();
    editedContact["id"] = editId;
    let path = "/contacts/" + editId + "/";
    await putData(path, editedContact);
}

async function reloadContacts() {
    await getContactsArray();
    hideForm();
    document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('selected'));
    hideMobileContactDetails();
    renderContacts();
}

function checkContactForm() {
    nameIsValid = nameCheck(nameRef.value);
    emailIsValid = emailCheck(emailRef.value);
    phoneIsValid = phoneNumberCheck(phoneRef.value);
    return nameIsValid && emailIsValid && phoneIsValid;
}

/**
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

function showError() {
    showInputError("name", nameIsValid);
    showInputError("email", emailIsValid);
    showInputError("phone", phoneIsValid);
}

function showInputError(inputRef, isValid) {
    if (!isValid) {
        switch (inputRef) {
            case "name":
                nameRef.classList.add('error');
                break;
            case "email":
                emailRef.classList.add('error');
                break;
            case "phone":
                phoneRef.classList.add('error');
                break;
        }
    }
}

nameRef.addEventListener("input", () => {
    nameRef.classList.remove('error');
});

emailRef.addEventListener("input", () => {
    emailRef.classList.remove('error');
});

phoneRef.addEventListener("input", () => {
    phoneRef.classList.remove('error');
});