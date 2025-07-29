let contacts = [
    {
        "firstName": "Anton",
        "lastName": "Mayer",
        "email": "antom@gmail.com",
        "phone": "+49 1111 111 11 1"
    },
    {
        "firstName": "Anja",
        "lastName": "Schulz",
        "email": "schulz@hotmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "firstName": "Benedikt",
        "lastName": "Ziegler",
        "email": "benedikt@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "firstName": "David",
        "lastName": "Eisenberg",
        "email": "davidberg@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "firstName": "Eva",
        "lastName": "Fischer",
        "email": "eva@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "firstName": "Emmanuel",
        "lastName": "Mauer",
        "email": "emmanuelma@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "firstName": "Marcel",
        "lastName": "Bauer",
        "email": "bauer@gmail.com",
        "phone": "+49 XXXX XXX XX X"
    },
    {
        "firstName": "Tatjana",
        "lastName": "Wolf",
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

/**
 * Renders all contacts in the contact list, sorted and grouped by initials.
 * Uses helper functions for sorting, grouping, and rendering.
 */
function renderContacts() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    const sorted = getSortedContactsForRender();
    const grouped = groupContactsByInitial(sorted);
    renderContactGroups(contactList, grouped);
    addContactItemListeners();
}

/**
 * Returns the contacts sorted by initials (first name + last name).
 * @returns {Array} Sorted array of contacts
 */
function getSortedContactsForRender() {
    return contacts
        .map(c => ({ ...c, name: `${c.firstName} ${c.lastName}`.trim() }))
        .sort((a, b) => {
            const initialsA = getInitials(`${a.firstName} ${a.lastName}`);
            const initialsB = getInitials(`${b.firstName} ${b.lastName}`);
            if (initialsA < initialsB) return -1;
            if (initialsA > initialsB) return 1;
            return a.name.localeCompare(b.name, 'de', { sensitivity: 'base' });
        });
}

/**
 * Groups contacts by the first letter of their initials.
 * @param {Array} sortedContacts - Sorted array of contacts
 * @returns {Object} Object with letters as keys and arrays of contacts as values
 */
function groupContactsByInitial(sortedContacts) {
    return sortedContacts.reduce((acc, contact) => {
        const initials = getInitials(`${contact.firstName} ${contact.lastName}`);
        const letter = initials[0] ? initials[0].toUpperCase() : '';
        if (!letter) return acc;
        (acc[letter] = acc[letter] || []).push(contact);
        return acc;
    }, {});
}

/**
 * Renders all contact groups (letter sections) into the contact list.
 * @param {HTMLElement} contactList - The list element for contacts
 * @param {Object} grouped - Object with letters as keys and arrays of contacts as values
 */
function renderContactGroups(contactList, grouped) {
    let globalIndex = 0;
    Object.keys(grouped).sort().forEach(letter => {
        contactList.innerHTML += getGroupTemplate(letter);
        globalIndex = renderContactsOfGroup(contactList, grouped[letter], globalIndex);
    });
}

/**
 * Renders all contacts of a group (same letter) into the contact list.
 * @param {HTMLElement} contactList - The list element for contacts
 * @param {Array} group - Array of contacts for a letter
 * @param {number} startIndex - Start index for the global contact count
 * @returns {number} New global index after rendering
 */
function renderContactsOfGroup(contactList, group, startIndex) {
    let idx = startIndex;
    group.forEach(contact => {
        const initials = getInitials(`${contact.firstName} ${contact.lastName}`);
        const name = `${contact.firstName} ${contact.lastName}`.trim();
        const colorClass = colorMap[name] || 'contact-avatar-color10';
        contactList.innerHTML += getContactListItemTemplate(contact, colorClass, initials, idx);
        idx++;
    });
    return idx;
}

/**
 * Returns a sorted copy of the contacts array.
 * Sorts by initials, then by name.
 * @returns {Array} Sorted contacts array.
 */
/**
 * Returns a sorted copy of the contacts array.
 * Sorts by initials, then by name.
 * @returns {Array} Sorted contacts array.
 */
function getSortedContacts() {
    // Map contacts to have a 'name' property if not present
    const contactsWithName = contacts.map(c => ({
        ...c,
        name: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim()
    }));
    return [...contactsWithName].sort((a, b) => {
        const initialsA = getInitials(a.name);
        const initialsB = getInitials(b.name);
        if (initialsA < initialsB) return -1;
        if (initialsA > initialsB) return 1;
        return a.name.localeCompare(b.name, 'de', { sensitivity: 'base' });
    });
}

/**
 * Groups contacts by their initial letter.
 * @param {Array} list - Array of contact objects.
 * @returns {Object} Grouped contacts by initial letter.
 */
/**
 * Groups contacts by their initial letter (last name preferred).
 * @param {Array} list - Array of contact objects.
 * @returns {Object} Grouped contacts by initial letter.
 */
function groupContactsByLetter(list) {
    return list.reduce((acc, contact) => {
        // Use lastName if available, otherwise firstName, fallback to empty string
        const letter = (contact.lastName ? contact.lastName[0] : (contact.firstName ? contact.firstName[0] : '')).toUpperCase();
        if (!letter) return acc;
        (acc[letter] = acc[letter] || []).push(contact);
        return acc;
    }, {});
}


/**
 * Adds click event listeners to all contact items for selection and details display.
 * Handles mobile view switching.
 */
/**
 * Adds click event listeners to all contact items for selection and details display.
 * Handles mobile view switching.
 */
function addContactItemListeners() {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.onclick = function (e) {
            const idx = parseInt(this.dataset.index);
            if (window.innerWidth <= 780) {
                showMobileContactDetails(idx);
            } else {
                toggleContactDetails(idx, this);
            }
            e.stopPropagation();
        };
    });
}

/**
 * Shows the contact details in mobile view, hides sidebar, shows back and edit button.
 * @param {number} idx - Index of the contact in the sorted array.
 */
/**
 * Shows the contact details in mobile view, hides sidebar, shows back and edit button.
 * @param {number} idx - Index of the contact in the sorted array.
 */
function showMobileContactDetails(idx) {
    // Hide sidebar, show contacts-section as overlay
    document.querySelector('.contact-sidebar').classList.add('hide-mobile-sidebar');
    const section = document.querySelector('.contacts-section');
    section.classList.add('show-mobile-section');
    // Ensure contact details container is visible
    const details = document.getElementById('contactListClicked');
    details.style.display = 'block';
    // Add back button if not present
    let backBtn = document.getElementById('mobileBackBtn');
    if (!backBtn) {
        backBtn = document.createElement('button');
        backBtn.className = 'mobile-back-btn';
        backBtn.id = 'mobileBackBtn';
        backBtn.innerHTML = '<img src="./assets/img/icons/content/help/back.png" alt="Back">';
        backBtn.onclick = hideMobileContactDetails;
        section.appendChild(backBtn);
    }
    backBtn.style.display = 'flex';
    // Zeige mobilen Edit-Button
    let editBtn = document.getElementById('mobileEditBtn');
    if (editBtn) {
        editBtn.style.display = 'flex';
        window._lastMobileEditIdx = idx;
    }
    // Remove any existing dropdown when switching contacts
    removeMobileEditDropdown();
    // Hide add-contact-btn-mobile
    document.querySelector('.add-contact-btn-mobile').classList.add('hide-mobile-edit');
    // Show details
    showContactDetails(getSortedContacts()[idx], idx);
}

/**
 * Toggles the mobile edit dropdown for Edit/Delete actions.
 * @param {number} idx - Index of the contact in the sorted array.
 */
function toggleMobileEditDropdown(idx) {
    const dropdown = document.getElementById('mobileEditDropdown');
    if (!dropdown) return;
    // Toggle show class (keine Manipulation von style.display!)
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    } else {
        // Set content if needed
        if (typeof getMobileEditDropdownTemplate === 'function') {
            dropdown.innerHTML = getMobileEditDropdownTemplate(idx);
        }
        dropdown.classList.add('show');
        // Hide dropdown on outside click
        setTimeout(() => {
            document.addEventListener('click', removeMobileEditDropdown, { once: true });
        }, 0);
    }
}

/**
 * Removes the mobile edit dropdown if present.
 */
function removeMobileEditDropdown() {
    const dropdown = document.getElementById('mobileEditDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}


/**
 * Toggles the contact details view for a selected contact item.
 * @param {number} idx - Index of the contact in the contacts array.
 * @param {HTMLElement} item - The clicked contact item element.
 */
/**
 * Toggles the contact details view for a selected contact item.
 * @param {number} idx - Index of the contact in the contacts array.
 * @param {HTMLElement} item - The clicked contact item element.
 */
function toggleContactDetails(idx, item) {
    const details = document.getElementById('contactListClicked');
    const sorted = getSortedContacts();
    if (lastShownContactIdx === idx) {
        details.style.display = 'none';
        item.classList.remove('selected');
        lastShownContactIdx = null;
    } else {
        document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        showContactDetails(sorted[idx], idx);
        details.style.display = '';
        lastShownContactIdx = idx;
    }
}


/**
 * Prepares the contact details HTML and updates the details container.
 * @param {Object} contact - The contact object to display.
 * @param {number} idx - Index of the contact in the contacts array.
 */
/**
 * Prepares the contact details HTML and updates the details container.
 * @param {Object} contact - The contact object to display.
 * @param {number} idx - Index of the contact in the contacts array.
 */
function showContactDetails(contact, idx) {
    const container = document.getElementById('contactListClicked');
    const { html, colorClass } = getContactDetailsHtml(contact, idx);
    container.innerHTML = html;
    // Animation: slide in from right
    container.classList.remove('active');
    container.classList.add('contact-list-clicked');
    setTimeout(() => {
        container.classList.add('active');
    }, 10);
}

/**
 * Returns the HTML and color class for the contact details view.
 * @param {Object} contact - The contact object.
 * @param {number} idx - Index of the contact in the contacts array.
 * @returns {{html: string, colorClass: string}}
 */
/**
 * Returns the HTML and color class for the contact details view.
 * @param {Object} contact - The contact object.
 * @param {number} idx - Index of the contact in the contacts array.
 * @returns {{html: string, colorClass: string}}
 */
function getContactDetailsHtml(contact, idx) {
    const name = contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
    const initials = getInitials(name);
    const colorClass = colorMap[name] || 'contact-avatar-color10';
    const contactForTemplate = {
        ...contact,
        name,
        initials
    };
    return {
        html: getContactDetailsTemplate(contactForTemplate, colorClass, initials, idx),
        colorClass
    };
}


/**
 * Shows the form container
 */
/**
 * Shows the add contact form and its modal overlay.
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
  // Reset avatar preview to default when opening modal
  setDefaultAvatar(document.getElementById('formAvatar'));
  // Add outside click listener
  setTimeout(() => {
    document.addEventListener('click', closeFormOnOutsideClick);
  }, 0);
}

/**
 * Hides the add contact form and its modal overlay.
 */
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
/**
 * Adds a new contact to the contacts array and updates the contact list.
 */
function addToContacts() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    if (!name || !email || !phone) return;
    // Split name into firstName and lastName
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');
    // Assign color class if not already present
    const fullName = `${firstName} ${lastName}`.trim();
    if (!colorMap[fullName]) {
        // Find next available color class (1-10, skipping used, but cycle if all used)
        const usedColors = Object.values(colorMap);
        let colorIdx = 1;
        while (usedColors.includes('contact-avatar-color' + colorIdx) && colorIdx <= 10) colorIdx++;
        if (colorIdx > 10) {
            // Cycle colors if all are used
            colorIdx = ((Object.keys(colorMap).length - 1) % 10) + 1;
        }
        colorMap[fullName] = 'contact-avatar-color' + colorIdx;
    }
    contacts.push({ firstName, lastName, email, phone });
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    // Reset avatar preview to default after adding
    setDefaultAvatar(document.getElementById('formAvatar'));
    renderContacts();
    hideForm();
}

/**
 * Updates the avatar in the add contact form based on the entered name.
 */
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
    // Vorschau: gleiche Farblogik wie beim Hinzufügen
    let colorClass = colorMap[name];
    if (!colorClass) {
        // Find next available color class (1-10, skipping used, but cycle if all used)
        const usedColors = Object.values(colorMap);
        let colorIdx = 1;
        while (usedColors.includes('contact-avatar-color' + colorIdx) && colorIdx <= 10) colorIdx++;
        if (colorIdx > 10) {
            colorIdx = ((Object.keys(colorMap).length - 1) % 10) + 1;
        }
        colorClass = 'contact-avatar-color' + colorIdx;
    }
    avatar.classList.add(colorClass);
    avatar.textContent = getInitials(name);
}

/**
 * Removes all possible avatar color classes from the avatar element.
 * @param {HTMLElement} avatar - The avatar element.
 */
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
/**
 * Sets the avatar element to the default image and color.
 * @param {HTMLElement} avatar - The avatar element.
 */

function setDefaultAvatar(avatar) {
    // Remove ALL color classes (not nur -color10)
    for (let i = 1; i <= 10; i++) avatar.classList.remove('contact-avatar-color' + i);
    avatar.innerHTML = '<img src="assets/img/icons/add-contact/person-avatar.svg" alt="Avatar">';
}

/**
 * Returns the initials for a given name (max 2 letters).
 * @param {string} name - The contact name.
 * @returns {string} Initials string.
 */
/**
 * Returns the initials for a given name (max 2 letters).
 * @param {string} name - The contact name.
 * @returns {string} Initials string.
 */
function getInitials(name) {
    // Liefert die Initialen (z.B. "Anton Mayer" -> "AM")
    return name.split(" ")
        .map(n => n[0].toUpperCase())
        .slice(0, 2)
        .join("");
}

/**
 * Cancels the add contact form and clears all input fields.
 */
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
/**
 * Fills the edit form fields and updates the avatar.
 * @param {Object} contact - The contact object.
 */
function fillEditFormFields(contact) {
    // Use contact.name if present, otherwise reconstruct from firstName/lastName
    const name = contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
    document.getElementById('editContactName').value = name;
    document.getElementById('editContactEmail').value = contact.email;
    document.getElementById('editContactPhone').value = contact.phone;
    updateEditFormAvatar();
}

/**
 * Hides the edit contact modal and its overlay.
 */
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

function hideMobileContactDetails() {
    document.querySelector('.contact-sidebar').classList.remove('hide-mobile-sidebar');
    const section = document.querySelector('.contacts-section');
    section.classList.remove('show-mobile-section');
    section.style.display = '';
    // Hide contact details container
    const details = document.getElementById('contactListClicked');
    details.style.display = '';
    // Hide back button
    const backBtn = document.getElementById('mobileBackBtn');
    if (backBtn) backBtn.style.display = 'none';
    // Hide edit button
    const editBtn = document.getElementById('mobileEditBtn');
    if (editBtn) editBtn.style.display = 'none';
    // Show add-contact-btn-mobile
    document.querySelector('.add-contact-btn-mobile').classList.remove('hide-mobile-edit');
}

/**
 * Restores the desktop view layout for the contacts section.
 * Removes mobile-specific classes from the contacts section and sidebar,
 * and ensures the contact details element is visible.
 *
 * @function
 */
function showDesktopView() {
    const section = document.querySelector('.contacts-section');
    const sidebar = document.querySelector('.contact-sidebar');
    const details = document.getElementById('contactListClicked');
    if (section) section.classList.remove('show-mobile-section');
    if (sidebar) sidebar.classList.remove('hide-mobile-sidebar');
    if (details) details.style.display = '';
}

function hideMobileButtons() {
    const backBtn = document.getElementById('mobileBackBtn');
    const editBtn = document.getElementById('mobileEditBtn');
    if (backBtn) backBtn.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';
}

function showAddContactBtnMobile() {
    const addBtn = document.querySelector('.add-contact-btn-mobile');
    if (addBtn) addBtn.classList.remove('hide-mobile-edit');
}

function closeMobileEditDropdownIfOpen() {
    if (typeof removeMobileEditDropdown === 'function') {
        removeMobileEditDropdown();
    }
}

function handleResponsiveCloseMobileSection() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 780) {
            showDesktopView();
            hideMobileButtons();
            closeMobileEditDropdownIfOpen();
            showAddContactBtnMobile();
        }
    });
}

// Direkt beim Laden aufrufen:
handleResponsiveCloseMobileSection();