let contacts = [];
let sortedContacts = [];
let lastShownContactIdx = null;

/**
 * Initializes the contact list and hides the add contact form on page load.
 */
async function init() {
    await getContactsArray();
    renderContacts();
    hideForm();
}

async function getContactsArray() {
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
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
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
        const lastNameA = a.name["last-name"];
        const lastNameB = b.name["last-name"];
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
    document.getElementById('contactListClicked').style.display = 'block';
    setupMobileBackButton(section);
    setupMobileEditButton(idx);
    document.querySelector('.add-contact-btn-mobile').classList.add('hide-mobile-edit');
    removeMobileEditDropdown();
    showContactDetails(getSortedContacts()[idx], idx);
}

function setupMobileBackButton(section) {
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
}

function setupMobileEditButton(idx) {
    const editBtn = document.getElementById('mobileEditBtn');
    if (editBtn) {
        editBtn.style.display = 'flex';
        window._lastMobileEditIdx = idx;
    }
}

function toggleMobileEditDropdown(idx) {
    const dropdown = document.getElementById('mobileEditDropdown');
    if (!dropdown) return;
    dropdown.classList.contains('show') ? hideMobileEditDropdown(dropdown) : showMobileEditDropdown(dropdown, idx);
}

function hideMobileEditDropdown(dropdown) {
    dropdown.classList.remove('show');
}

function showMobileEditDropdown(dropdown, idx) {
    if (typeof getMobileEditDropdownTemplate === 'function') {
        dropdown.innerHTML = getMobileEditDropdownTemplate(idx);
    }
    dropdown.classList.add('show');
    setTimeout(() => document.addEventListener('click', removeMobileEditDropdown, { once: true }), 0);
}

function removeMobileEditDropdown() {
    const dropdown = document.getElementById('mobileEditDropdown');
    if (dropdown) dropdown.classList.remove('show');
}


function toggleContactDetails(idx, item) {
    const details = document.getElementById('contactListClicked');
    const sorted = getSortedContacts();
    if (lastShownContactIdx === idx) {
        // details.style.display = 'none';
        details.innerHTML = '';
        item.classList.remove('selected');
        lastShownContactIdx = null;
    } else {
        document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        showContactDetails(sorted[idx], idx);
        // details.style.display = '';
        lastShownContactIdx = idx;
    }
}

function showContactDetails(contact, idx) {
    const container = document.getElementById('contactListClicked');
    const initials = getInitials(contact.name["first-name"] + " " + contact.name["last-name"]);
    const colorClass = contact.color;
    container.innerHTML = getContactDetailsTemplate(contact, colorClass, initials, idx);
    // container.classList.remove('active');
    // container.classList.add('contact-list-clicked');
    setTimeout(() => container.classList.add('active'), 10);
}

function hideMobileContactDetails() {
    document.querySelector('.contact-sidebar').classList.remove('hide-mobile-sidebar');
    const section = document.querySelector('.contacts-section');
    section.classList.remove('show-mobile-section');
    section.style.display = '';
    // document.getElementById('contactListClicked').style.display = '';
    hideMobileButtons();
    document.querySelector('.add-contact-btn-mobile').classList.remove('hide-mobile-edit');
}

function hideMobileButtons() {
    const backBtn = document.getElementById('mobileBackBtn');
    const editBtn = document.getElementById('mobileEditBtn');
    if (backBtn) backBtn.style.display = 'none';
    if (editBtn) editBtn.style.display = 'none';
}

function showDesktopView() {
    const section = document.querySelector('.contacts-section');
    const sidebar = document.querySelector('.contact-sidebar');
    const details = document.getElementById('contactListClicked');
    if (section) section.classList.remove('show-mobile-section');
    if (sidebar) sidebar.classList.remove('hide-mobile-sidebar');
    // if (details) details.style.display = '';
}

function showAddContactBtnMobile() {
    const addBtn = document.querySelector('.add-contact-btn-mobile');
    if (addBtn) addBtn.classList.remove('hide-mobile-edit');
}

function closeMobileEditDropdownIfOpen() {
    if (typeof removeMobileEditDropdown === 'function') removeMobileEditDropdown();
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

handleResponsiveCloseMobileSection();