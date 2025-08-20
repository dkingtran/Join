let contacts = [];
let sortedContacts = [];
let lastShownContactIdx = null;

/**
 * Initializes the contact list and hides the add contact form on page load.
 */
async function init() {
    await getContactsArray();
    renderContacts();
}

async function getContactsArray() {
    contacts = [];
    let contactObjects = await loadData("/contacts/");
    Object.keys(contactObjects).forEach(key => {
        contacts.push(contactObjects[key]);
    });
}

/**
 * Renders all contacts in the contact list, sorted and grouped by initials.
 * Uses helper functions for sorting, grouping, and rendering.
 */
function renderContacts() {
    const contactList = document.getElementById('list-contact');
    contactList.innerHTML = '';
    sortedContacts = [];
    sortedContacts = getSortedContacts();
    const grouped = groupContactsByInitial();
    renderContactGroups(contactList, grouped);
    addContactItemListeners();
}

/**
 * Returns the contacts sorted by initials (first name + last name).
 * @returns {Array} Sorted array of contacts
 */
function getSortedContacts() {
    return contacts.sort((a, b) => {
        return a.name["last-name"].localeCompare(b.name["last-name"], 'en', { sensitivity: 'base' });
    });
}

function groupContactsByInitial() {
    return sortedContacts.reduce((acc, contact) => {
        const initial = contact.name["first-name"].slice(0, 1);
        const letter = initial ? initial.toUpperCase() : '';
        if (!letter) return acc;
        (acc[letter] = acc[letter] || []).push(contact);
        return acc;
    }, {});
}

function renderContactGroups(contactList, grouped) {
    Object.keys(grouped).sort().forEach(letter => {
        contactList.innerHTML += getGroupTemplate(letter);
        renderContactsOfGroup(contactList, grouped[letter]);
    });
}

function renderContactsOfGroup(contactList, group) {
    group.forEach(contact => {
        const initials = getInitials(contact.name["first-name"] + " " + contact.name["last-name"]);
        const colorClass = contact.color;
        let sortedindex = sortedContacts.indexOf(contact);
        contactList.innerHTML += getContactListItemTemplate(contact, colorClass, initials, sortedindex);
    });
}

function addContactItemListeners() {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.onclick = function (e) {
            const idx = parseInt(this.dataset.index);
            (window.innerWidth <= 780) ? showMobileContactDetails(idx) : toggleContactDetails(idx, this);
            e.stopPropagation();
        };
    });
}

function showMobileContactDetails(idx) {
    document.querySelector('.contact-sidebar').classList.add('hide-mobile-sidebar');
    const section = document.querySelector('.contacts-section');
    section.classList.add('show-mobile-section');
    document.getElementById('clicked-list-contact').style.display = 'block';
    document.getElementById('mobile-back-button').style.display = 'flex';
    document.getElementById('mobile-edit-button').style.display = 'flex';
    document.querySelector('.add-contact-btn-mobile').classList.add('hide-mobile-edit');
    showContactDetails(sortedContacts[idx], idx);
    lastShownContactIdx = idx;
}

function toggleMobileEditDropdown() {
    const dropdown = document.getElementById('dropdown-mobile-edit');
    if (!dropdown) return;
    dropdown.classList.contains('show') ? hideMobileEditDropdown(dropdown) : showMobileEditDropdown(dropdown, lastShownContactIdx);
}

function hideMobileEditDropdown(dropdown) {
    dropdown.classList.remove('show');
}

function showMobileEditDropdown(dropdown, idx) {
    dropdown.innerHTML = getMobileEditDropdownTemplate(idx);
    dropdown.classList.add('show');
}

document.addEventListener('click', e => {
    const dropdown = document.getElementById('dropdown-mobile-edit');
    if (!dropdown.contains(e.target)) {
        if (dropdown) dropdown.classList.remove('show');
    }
});


function toggleContactDetails(idx, item) {
    const details = document.getElementById('clicked-list-contact');
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

function showContactDetails(contact, idx) {
    const container = document.getElementById('clicked-list-contact');
    const initials = getInitials(contact.name["first-name"] + " " + contact.name["last-name"]);
    const colorClass = contact.color;
    container.innerHTML = getContactDetailsTemplate(contact, colorClass, initials, idx);
    container.classList.add('contact-list-clicked');
    container.classList.add('active');
}

function hideMobileContactDetails() {
    document.querySelector('.contact-sidebar').classList.remove('hide-mobile-sidebar');
    const section = document.querySelector('.contacts-section');
    section.classList.remove('show-mobile-section');
    document.getElementById('clicked-list-contact').innerHTML = '';
    hideMobileButtons();
    document.querySelector('.add-contact-btn-mobile').classList.remove('hide-mobile-edit');
    lastShownContactIdx = null;
}

function hideMobileButtons() {
    const backBtn = document.getElementById('mobile-back-button');
    const editBtn = document.getElementById('mobile-edit-button');
    if (backBtn) backBtn.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';
}

function showDesktopView() {
    const section = document.querySelector('.contacts-section');
    const sidebar = document.querySelector('.contact-sidebar');
    if (section) section.classList.remove('show-mobile-section');
    if (sidebar) sidebar.classList.remove('hide-mobile-sidebar');
}

function showAddContactBtnMobile() {
    const addBtn = document.querySelector('.add-contact-btn-mobile');
    if (addBtn) addBtn.classList.remove('hide-mobile-edit');
}

function removeMobileEditDropdown() {
    const dropdown = document.getElementById('dropdown-mobile-edit');
    dropdown.classList.remove('show');
}

function handleResponsiveCloseMobileSection() {
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
}

handleResponsiveCloseMobileSection();