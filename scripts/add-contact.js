let contacts = [
    {
        "name": "Anton Mayer",
        "email": "antom@gmail.com",
        "phone": "+49 1111 111 11 1"
    },
    {
        "name": "Anja Schulz",
        "email": "schulz@hotmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "name": "Benedikt Ziegler",
        "email": "benedikt@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "name": "David Eisenberg",
        "email": "davidberg@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "name": "Eva Fischer",
        "email": "eva@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "name": "Emmanuel Mauer",
        "email": "emmanuelma@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "name": "Marcel Bauer",
        "email": "bauer@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "name": "Tatjana Wolf",
        "email": "wolf@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    }
];

// Mapping name -> color class
const colorMap = {
    'Anton Mayer': 'contact-avatar-color1',
    'Anja Schulz': 'contact-avatar-color2',
    'Benedikt Ziegler': 'contact-avatar-color3',
    'David Eisenberg': 'contact-avatar-color4',
    'Eva Fischer': 'contact-avatar-color5',
    'Emmanuel Mauer': 'contact-avatar-color6',
    'Marcel Bauer': 'contact-avatar-color7',
    'Tatjana Wolf': 'contact-avatar-color8',
    'Sofia Müller': 'contact-avatar-color9',
    '': 'contact-avatar-color10' // Default color for any other names
};

let contactIndex = 0;
let lastShownContactIdx = null;

/**
 * Initializes the contact list and hides the add contact form on page load.
 */
function init() {
    renderContacts();
    hideForm();
}
/**
 * Renders all contacts in the contact list.
 * Sorts and groups contacts, then renders each group.
 */
function renderContacts() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    const sorted = getSortedContacts();
    const grouped = groupContactsByLetter(sorted);
    let globalIndex = 0;
    Object.keys(grouped).sort().forEach(letter => {
        contactList.innerHTML += getGroupTemplate(letter, grouped[letter], sorted, globalIndex);
        globalIndex += grouped[letter].length;
    });
    addContactItemListeners();
}

/**
 * Returns a sorted copy of the contacts array.
 * Sorts by initials, then by name.
 * @returns {Array} Sorted contacts array.
 */
function getSortedContacts() {
    return [...contacts].sort((a, b) => {
        const initialsA = getInitials(a.name);
        const initialsB = getInitials(b.name);
        if (initialsA < initialsB) return -1;
        if (initialsA > initialsB) return 1;
        return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
    });
}

/**
 * Groups contacts by their initial letter.
 * @param {Array} list - Array of contact objects.
 * @returns {Object} Grouped contacts by initial letter.
 */
function groupContactsByLetter(list) {
    return list.reduce((acc, contact) => {
        const letter = contact.name[0].toUpperCase();
        (acc[letter] = acc[letter] || []).push(contact);
        return acc;
    }, {});
}

/**
 * Returns the HTML template for a contact group section.
 * @param {string} letter - The initial letter for the group.
 * @param {Array} contactsArr - Array of contacts in the group.
 * @param {Array} sortedArr - The full sorted contacts array.
 * @param {number} startIdx - The starting global index for this group.
 * @returns {string} HTML string for the group section.
 */
function getGroupTemplate(letter, contactsArr, sortedArr, startIdx) {
    return `<div class="contact-group-letter">${letter}</div><hr class="contact-divider">` +
        contactsArr.map((c, i) => {
            // Find the global index of this contact in the sorted array
            const globalIdx = sortedArr.findIndex(contact => contact === c);
            return getContactListItemTemplate(c, colorMap[c.name] || 'contact-avatar-color1', getInitials(c.name), globalIdx);
        }).join('');
}

/**
 * Adds click event listeners to all contact items for selection and details display.
 */
function addContactItemListeners() {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.onclick = function (e) {
            const idx = parseInt(this.dataset.index);
            toggleContactDetails(idx, this);
            e.stopPropagation();
        };
    });
}

/**
 * Toggles the contact details view for a selected contact item.
 * @param {number} idx - Index of the contact in the contacts array.
 * @param {HTMLElement} item - The clicked contact item element.
 */
function toggleContactDetails(idx, item) {
    const details = document.getElementById('contactListClicked');
    if (lastShownContactIdx === idx) {
        details.style.display = 'none';
        item.classList.remove('selected');
        lastShownContactIdx = null;
    } else {
        document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        showContactDetails(contacts[idx], idx);
        details.style.display = '';
        lastShownContactIdx = idx;
    }
}


/**
 * Displays the details of a contact in the details container.
 * @param {Object} contact - The contact object to display.
 * @param {number} idx - Index of the contact in the contacts array.
 */
function showContactDetails(contact, idx) {
    const container = document.getElementById('contactListClicked');
    const colorClass = colorMap[contact.name] || 'contact-avatar-color10';
    const initials = contact.name.split(' ').map(n => n[0]).join('');
    container.innerHTML = getContactDetailsTemplate(contact, colorClass, initials, idx);
    // Animation: slide in from right
    container.classList.remove('active');
    container.classList.add('contact-list-clicked');
    setTimeout(() => {
        container.classList.add('active');
    }, 10);
}


/**
 * Shows the form container
 */
/**
 * Shows the add contact form and its modal overlay.
 */
function showForm() {
  const form = document.getElementById('formContainer');
  form.classList.add('show');
  // Show overlay
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.add('show');
  // Add outside click listener
  setTimeout(() => {
    document.addEventListener('click', closeFormOnOutsideClick);
  }, 0);
}

/**
 * Hides the add contact form and its modal overlay.
 */
function hideForm() {
  const form = document.getElementById('formContainer');
  form.classList.remove('show');
  // Hide overlay
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('show');
  document.removeEventListener('click', closeFormOnOutsideClick);
}


// Closes the form if clicking outside the form container
/**
 * Closes the add contact form if clicking outside the form container.
 * @param {MouseEvent} e - The click event.
 */
function closeFormOnOutsideClick(e) {
    const formContainer = document.getElementById('formContainer');
    if (formContainer.classList.contains('show') && !formContainer.contains(e.target)) {
        hideForm();
    }
}


/**
 * Adds a new contact to the contacts array.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
/**
 * Adds a new contact to the contacts array and updates the contact list.
 */
function addToContacts() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    if (!name || !email || !phone) return;
    contacts.push({ name, email, phone });
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    renderContacts();
    hideForm();
}

/**
 * Updates the avatar in the add contact form based on the entered name.
 */
function updateFormAvatar() {
    const name = document.getElementById("contactName").value.trim();
    const avatar = document.getElementById("formAvatar");
    resetAvatarColors(avatar);
    if (!name) {
        setDefaultAvatar(avatar);
        return;
    }
    avatar.classList.add(colorMap[name] || 'contact-avatar-color10');
    avatar.textContent = getInitials(name);
}

/**
 * Removes all possible avatar color classes from the avatar element.
 * @param {HTMLElement} avatar - The avatar element.
 */
function resetAvatarColors(avatar) {
    for (let i = 1; i <= 10; i++) avatar.classList.remove('contact-avatar-color' + i);
}

/**
 * Sets the avatar element to the default image and color.
 * @param {HTMLElement} avatar - The avatar element.
 */
function setDefaultAvatar(avatar) {
    avatar.classList.remove('contact-avatar-color10');
    avatar.innerHTML = '<img src="assets/img/icons/add-contact/person-avatar.svg" alt="Avatar">';
}

/**
 * Returns the initials for a given name (max 2 letters).
 * @param {string} name - The contact name.
 * @returns {string} Initials string.
 */
function getInitials(name) {
    return name.split(" ")
        .filter(Boolean)
        .map(n => n[0].toUpperCase())
        .filter(ch => /^[A-Z]$/.test(ch))
        .slice(0, 2)
        .join("");
}

/**
 * Cancels the add contact form and clears all input fields.
 */
function cancelForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    hideForm();
}

/**
 * Opens the edit contact modal and fills in the contact data.
 * @param {number} idx - Index of the contact to edit.
 */
function showEditForm(idx) {
    fillEditFormFields(contacts[idx]);
    document.getElementById('editFormContainer').classList.add('show');
    const overlay = document.getElementById('editModalOverlay');
    if (overlay) overlay.classList.add('show');
    hideForm();
    setTimeout(() => document.addEventListener('click', closeEditFormOnOutsideClick), 0);
    window.editContactIdx = idx;
}

// Add this function to handle the edit button click
/**
 * Handles the edit button click for a contact item.
 * @param {number} idx - Index of the contact to edit.
 */
function editContact(idx) {
    showEditForm(idx);
}

/**
 * Fills the edit form fields and updates the avatar.
 * @param {Object} contact - The contact object.
 */
function fillEditFormFields(contact) {
    document.getElementById('editContactName').value = contact.name;
    document.getElementById('editContactEmail').value = contact.email;
    document.getElementById('editContactPhone').value = contact.phone;
    updateEditFormAvatar();
}

/**
 * Hides the edit contact modal and its overlay.
 */
function hideEditForm() {
    document.getElementById('editFormContainer').classList.remove('show');
    // Hide overlay
    const overlay = document.getElementById('editModalOverlay');
    if (overlay) overlay.classList.remove('show');
    document.removeEventListener('click', closeEditFormOnOutsideClick);
}

// Closes the edit form if clicking outside the edit form container
/**
 * Closes the edit contact modal if clicking outside the edit form container.
 * @param {MouseEvent} e - The click event.
 */
function closeEditFormOnOutsideClick(e) {
    const editFormContainer = document.getElementById('editFormContainer');
    if (editFormContainer.classList.contains('show') && !editFormContainer.contains(e.target)) {
        hideEditForm();
    }
}

/**
 * Updates the avatar in the edit contact form based on the entered name.
 */
function updateEditFormAvatar() {
    const name = document.getElementById('editContactName').value.trim();
    const avatar = document.getElementById('editFormAvatar');
    for (let i = 1; i <= 10; i++) avatar.classList.remove('contact-avatar-color' + i);
    if (!name) {
        avatar.classList.add('contact-avatar-color10');
        avatar.innerHTML = '<img src="assets/img/icons/add-contact/person-avatar.svg" alt="Avatar">';
        return;
    }
    avatar.classList.add(colorMap[name] || 'contact-avatar-color10');
    avatar.textContent = name.split(' ')
        .filter(Boolean)
        .map(n => n[0].toUpperCase())
        .slice(0, 2)
        .join('');
}