let contacts = [];
let sortedContacts = [];
let lastShownContactIdx = null;

/**
 * Fetches and renders the contact list.
 */
async function init() {
    await getContactsArray();
    renderContacts();
}

/**
 * @async
 * @function
 * 
 * Asynchronously loads contact objects from the "/contacts/" endpoint and populates the global `contacts` array.
 */
async function getContactsArray() {
    contacts = [];
    let contactObjects = await loadData("/contacts/");
    Object.keys(contactObjects).forEach(key => {
        contacts.push(contactObjects[key]);
    });
}

/**
 * @function
 * 
 * Renders all contacts in the contact list, sorted and grouped by initials.
 * Uses helper functions for sorting, grouping, and rendering.
 */
function renderContacts() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    sortedContacts = [];
    sortedContacts = getSortedContacts();
    const grouped = groupContactsByInitial();
    renderContactGroups(contactList, grouped);
    addContactItemListeners();
}

/**
 * @function
 * 
 * Returns the contacts sorted by last name.
 * 
 * @returns {Array} Sorted array of contacts.
 */
function getSortedContacts() {
    return contacts.sort((a, b) => {
        return a.name["last-name"].localeCompare(b.name["last-name"], 'en', { sensitivity: 'base' });
    });
}

/**
 * @function
 * 
 * Groups contacts by the uppercase initial letter of their first name.
 * Iterates over the `sortedContacts` array and organizes each contact into an object,
 * where the keys are uppercase letters representing the first character of the contact's first name,
 * and the values are arrays of contacts whose first name starts with that letter.
 * 
 * @returns {Object.<string, Array<Object>>} An object mapping uppercase initials to arrays of contact objects.
 */
function groupContactsByInitial() {
    return sortedContacts.reduce((acc, contact) => {
        const initial = contact.name["first-name"].slice(0, 1);
        const letter = initial ? initial.toUpperCase() : '';
        if (!letter) return acc;
        (acc[letter] = acc[letter] || []).push(contact);
        return acc;
    }, {});
}

/**
 * @function
 * 
 * @param {HTMLElement} contactList - The DOM element where contact groups will be rendered.
 * @param {Object.<string, Array>} grouped - An object where each key is a group letter and the value is an array of contacts belonging to that group.
 * 
 * Renders contact groups into the provided contact list element.
 * Iterates over the grouped contacts object, sorted by group letter,
 * and appends each group template and its contacts to the contact list.
 */
function renderContactGroups(contactList, grouped) {
    Object.keys(grouped).sort().forEach(letter => {
        contactList.innerHTML += getGroupTemplate(letter);
        renderContactsOfGroup(contactList, grouped[letter]);
    });
}

/**
 * @function
 * 
 * @param {HTMLElement} contactList - The DOM element where the contact items will be rendered.
 * @param {Array<Object>} group - An array of contact objects to be rendered.
 * 
 * Renders a list of contacts belonging to a specific letterßgroup into the provided contact list element.
 */
function renderContactsOfGroup(contactList, group) {
    group.forEach(contact => {
        const initials = getInitials(contact.name["first-name"] + " " + contact.name["last-name"]);
        const colorClass = contact.color;
        let sortedindex = sortedContacts.indexOf(contact);
        contactList.innerHTML += getContactListItemTemplate(contact, colorClass, initials, sortedindex);
    });
}

/**
 * @function
 * 
 * Attaches click event listeners to all elements with the 'contact-item' class.
 * On click, determines the index of the contact and displays its details.
 * Uses a mobile-specific function if the window width is 780px or less,
 * otherwise toggles the contact details in the desktop view.
 */
function addContactItemListeners() {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.onclick = function (e) {
            const idx = parseInt(this.dataset.index);
            (window.innerWidth <= 780) ? showMobileContactDetails(idx) : toggleContactDetails(idx, this);
            e.stopPropagation();
        };
    });
}

/**
 * @function
 * 
 * @param {number} idx - The index of the contact in the sortedContacts array to display.
 * 
 * Displays the contact details for a selected contact on mobile devices.
 * Hides the contact sidebar, shows the contact details section, and updates the UI for mobile view.
 * Also sets the last shown contact index.
 */
function showMobileContactDetails(idx) {
    document.querySelector('.contact-sidebar').classList.add('hide-mobile-sidebar');
    const section = document.querySelector('.contacts-section');
    section.classList.add('show-mobile-section');
    document.getElementById('contactListClicked').style.display = 'block';
    document.getElementById('mobileBackBtn').style.display = 'flex';
    document.getElementById('mobileEditBtn').style.display = 'flex';
    document.querySelector('.add-contact-btn-mobile').classList.add('hide-mobile-edit');
    showContactDetails(sortedContacts[idx], idx);
    lastShownContactIdx = idx;
}

/**
 * @function
 * 
 * Toggles the visibility of the mobile edit dropdown menu.
 * If the dropdown is currently shown, it will be hidden; otherwise, it will be displayed.
 */
function toggleMobileEditDropdown() {
    const dropdown = document.getElementById('mobileEditDropdown');
    if (!dropdown) return;
    dropdown.classList.contains('show') ? hideMobileEditDropdown(dropdown) : showMobileEditDropdown(dropdown, lastShownContactIdx);
}

/**
 * @function
 * 
 * @param {HTMLElement} dropdown - The dropdown element to hide.
 * 
 * Hides the mobile edit dropdown by removing the 'show' class from the specified element.
 */
function hideMobileEditDropdown(dropdown) {
    dropdown.classList.remove('show');
}

/**
 * @function
 * 
 * Displays the mobile edit dropdown button for a contact by setting its inner HTML
 * and adding the 'show' class to make it visible.
 *
 * @param {HTMLElement} dropdown - The DOM element representing the dropdown menu.
 * @param {number} idx - The index of the contact to be edited.
 */
function showMobileEditDropdown(dropdown, idx) {
    dropdown.innerHTML = getMobileEditDropdownTemplate(idx);
    dropdown.classList.add('show');
}

/**
 * Adds event listener to mobile dropdown to close it on outside click.
 */
document.addEventListener('click', e => {
    const dropdown = document.getElementById('mobileEditDropdown');
    if (!dropdown.contains(e.target)) {
        if (dropdown) dropdown.classList.remove('show');
    }
});

/**
 * @function
 * 
 * Toggles the display of contact details for a selected contact.
 * If the contact is already shown, it hides the details and deselects the item.
 * Otherwise, it highlights the selected contact and displays its details.
 *
 * @param {number} idx - The index of the contact in the sorted contacts array.
 * @param {HTMLElement} item - The DOM element representing the contact item.
 */
function toggleContactDetails(idx, item) {
    const details = document.getElementById('contactListClicked');
    const sorted = getSortedContacts();
    if (lastShownContactIdx === idx) {
        details.innerHTML = '';
        item.classList.remove('selected');
        details.classList.remove('active');
        lastShownContactIdx = null;
    } else {
        document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        showContactDetails(sorted[idx], idx);
        lastShownContactIdx = idx;
    }
}

/**
 * @function
 * 
 * Displays the details of a selected contact in the UI.
 *
 * Retrieves the contact's initials and color, then renders the contact details
 * template inside the 'contactListClicked' container. Also adds relevant CSS classes
 * to indicate the contact is selected and active.
 *
 * @param {Object} contact - The contact object containing user details.
 * @param {number} idx - The index of the contact in the contact list.
 */
function showContactDetails(contact, idx) {
    const container = document.getElementById('contactListClicked');
    const initials = getInitials(contact.name["first-name"] + " " + contact.name["last-name"]);
    const colorClass = contact.color;
    container.innerHTML = getContactDetailsTemplate(contact, colorClass, initials, idx);
    container.classList.add('contact-list-clicked');
    container.classList.add('active');
}

/**
 * @function
 * 
 * Hides the mobile contact details view and resets related UI elements.
 */
function hideMobileContactDetails() {
    document.querySelector('.contact-sidebar').classList.remove('hide-mobile-sidebar');
    const section = document.querySelector('.contacts-section');
    section.classList.remove('show-mobile-section');
    document.getElementById('contactListClicked').innerHTML = '';
    hideMobileButtons();
    document.querySelector('.add-contact-btn-mobile').classList.remove('hide-mobile-edit');
    lastShownContactIdx = null;
}

/**
 * @function 
 * 
 * Hides the mobile back- and dropdown-button for shown contact details.
 */
function hideMobileButtons() {
    const backBtn = document.getElementById('mobileBackBtn');
    const editBtn = document.getElementById('mobileEditBtn');
    if (backBtn) backBtn.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';
}

/**
 * @function
 * 
 * Restores the desktop view for the contacts section by removing mobile-specific CSS classes.
 * - Removes 'show-mobile-section' from the contacts section.
 * - Removes 'hide-mobile-sidebar' from the contact sidebar.
 */
function showDesktopView() {
    const section = document.querySelector('.contacts-section');
    const sidebar = document.querySelector('.contact-sidebar');
    if (section) section.classList.remove('show-mobile-section');
    if (sidebar) sidebar.classList.remove('hide-mobile-sidebar');
}

/**
 * @function
 * 
 * Displays the "Add Contact" button on mobile devices by removing the 'hide-mobile-edit' class
 * from the element with the 'add-contact-btn-mobile' class, if it exists in the DOM.
 */
function showAddContactBtnMobile() {
    const addBtn = document.querySelector('.add-contact-btn-mobile');
    if (addBtn) addBtn.classList.remove('hide-mobile-edit');
}

/**
 * @function
 * 
 * Hides the mobile edit dropdown by removing the 'show' class
 * from the element with the ID 'mobileEditDropdown'.
 */
function removeMobileEditDropdown() {
    const dropdown = document.getElementById('mobileEditDropdown');
    dropdown.classList.remove('show');
}

/**
 * Adds event listener for resize to window.
 * Executes several functions to hide mobile Elements if width exceeds 780px.
 */
window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
        showDesktopView();
        hideMobileButtons();
        removeMobileEditDropdown();
        showAddContactBtnMobile();
        let selectedContact = document.querySelector(`[data-index="${lastShownContactIdx}"]`);
        if (selectedContact) selectedContact.classList.add('selected');
    } else {
        document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('selected'));
    }
});