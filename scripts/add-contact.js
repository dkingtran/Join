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

function init() {
    renderContacts();
    hideForm();
}

/**
 * Renders all contacts in the contact list
 */
function renderContacts() {

    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    contactIndex = 0;
    // Sort contacts by initials (e.g. AM before AS), German alphabet, case-insensitive
    let sorted = [...contacts].sort((a, b) => {
        const initialsA = a.name.split(' ').map(n => n[0].toUpperCase()).join('');
        const initialsB = b.name.split(' ').map(n => n[0].toUpperCase()).join('');
        return initialsA.localeCompare(initialsB, 'de', { sensitivity: 'base' });
    });
    // Group by initial letter
    let grouped = {};
    sorted.forEach(contact => {
        let letter = contact.name.charAt(0).toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(contact);
    });


    Object.keys(grouped).sort().forEach((letter) => {
        contactList.innerHTML += `<div class="contact-group-letter">${letter}</div>`;
        contactList.innerHTML += '<hr class="contact-divider">';
        grouped[letter].forEach((contact) => {
            const colorClass = colorMap[contact.name] || 'contact-avatar-color1';
            contactList.innerHTML += `
                <div class="contact-item" data-index="${contactIndex}">
                    <div class="contact-avatar ${colorClass}">${contact.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="contact-item-content">
                        <div class="contact-name">${contact.name}</div>
                        <div class="contact-email">${contact.email}</div>
                    </div>
                </div>
            `;
            contactIndex++;
        });
    });

    // Selection logic
    let contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const idx = parseInt(this.dataset.index);
            // Toggle logic: if same contact, hide details
            if (lastShownContactIdx === idx) {
                document.getElementById('contactListClicked').style.display = 'none';
                contactItems.forEach(i => i.classList.remove('selected'));
                lastShownContactIdx = null;
            } else {
                contactItems.forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                showContactDetails(contacts[idx], idx);
                document.getElementById('contactListClicked').style.display = '';
                lastShownContactIdx = idx;
            }
            e.stopPropagation();
        });
    });

    // Remove selection when clicking outside the contact list
    document.addEventListener('click', function(e) {
        const contactList = document.getElementById('contactList');
        if (!contactList.contains(e.target)) {
            contactItems.forEach(i => i.classList.remove('selected'));
        }
    });
}


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

function hideForm() {
  const form = document.getElementById('formContainer');
  form.classList.remove('show');
  // Hide overlay
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('show');
  document.removeEventListener('click', closeFormOnOutsideClick);
}


// Closes the form if clicking outside the form container
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

function updateFormAvatar() {
    const name = document.getElementById("contactName").value.trim();
    const avatar = document.getElementById("formAvatar");
    for (let i = 1; i <= 10; i++) avatar.classList.remove('contact-avatar-color' + i);
    if (!name) {
        avatar.classList.remove('contact-avatar-color10');
        avatar.innerHTML = '<img src="assets/img/icons/add-contact/person-avatar.svg" alt="Avatar">';
        return;
    }
    avatar.classList.add(colorMap[name] || 'contact-avatar-color10');
    avatar.textContent = name.split(" ")
        .filter(Boolean)
        .map(n => n[0].toUpperCase())
        .filter(ch => /^[A-Z]$/.test(ch)) // Only letters as initials
        .slice(0, 2)
        .join("");
}


/**
 * * Cancels the form by clearing the input fields.
 */
function cancelForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    hideForm();
}


/**
 * Opens the edit contact modal, fills in the contact data, and shows the correct avatar.
 * @param {number} idx - Index of the contact to edit
 */
function showEditForm(idx) {
    const contact = contacts[idx];
    document.getElementById('editContactName').value = contact.name;
    document.getElementById('editContactEmail').value = contact.email;
    document.getElementById('editContactPhone').value = contact.phone;
    updateEditFormAvatar();
    const editForm = document.getElementById('editFormContainer');
    editForm.classList.add('show');
    // Show overlay
    const overlay = document.getElementById('editModalOverlay');
    if (overlay) overlay.classList.add('show');
    hideForm();
    // Add outside click listener for edit form
    setTimeout(() => {
        document.addEventListener('click', closeEditFormOnOutsideClick);
    }, 0);
    // Store index for saveEditContact
    window.editContactIdx = idx;
}

function hideEditForm() {
    document.getElementById('editFormContainer').classList.remove('show');
    // Hide overlay
    const overlay = document.getElementById('editModalOverlay');
    if (overlay) overlay.classList.remove('show');
    document.removeEventListener('click', closeEditFormOnOutsideClick);
}

// Closes the edit form if clicking outside the edit form container
function closeEditFormOnOutsideClick(e) {
    const editFormContainer = document.getElementById('editFormContainer');
    if (editFormContainer.classList.contains('show') && !editFormContainer.contains(e.target)) {
        hideEditForm();
    }
}

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

// Add this function to handle the edit button click
function editContact(idx) {
    showEditForm(idx);
}