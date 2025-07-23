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

    // Sortiere Kontakte alphabetisch nach Name
    let sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    // Gruppiere nach Anfangsbuchstaben
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
            contactList.innerHTML += `
                <div class="contact-item" data-index="${contactIndex}">
                    <div class="contact-avatar">${contact.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="contact-item-content">
                        <div class="contact-name">${contact.name}</div>
                        <div class="contact-email">${contact.email}</div>
                    </div>
                </div>
            `;
            contactIndex++;
        });
    });

    // Auswahl-Logik
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

    // Entferne Auswahl beim Klick außerhalb der Kontaktliste
    document.addEventListener('click', function(e) {
        const contactList = document.getElementById('contactList');
        if (!contactList.contains(e.target)) {
            contactItems.forEach(i => i.classList.remove('selected'));
        }
    });
}


function showContactDetails(contact, idx) {
    const container = document.getElementById('contactListClicked');
    container.innerHTML = `
        <div class="contact-details">
            <div class="contact-details-top">
                <div class="contact-avatar-clicked">${contact.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="contact-name-edit-delete">
                    <div class="contact-name-clicked">${contact.name}</div>
                    <div class="contact-details-actions">
                        <button class="edit-btn" onclick="editContact(${idx})"><img src="assets/img/icons/add-contact/edit.svg">Edit</button>
                        <button class="delete-btn" onclick="deleteContact(${idx})"><img src="assets/img/icons/add-contact/delete.svg">Delete</button>
                    </div>
                </div>
            </div>
            <div class="contact-details-info">
                <div class="contact-details-info-title">Contact Information</div>
                <div class="contact-details-info-section">
                    <div class="contact-details-info-section-title">Email</div>
                    <div class="contact-details-info-email">${contact.email}</div>
                </div>
                <div class="contact-details-info-section">
                    <div class="contact-details-info-section-title">Phone</div>
                    <div class="contact-details-info-phone">${contact.phone}</div>
                </div>
            </div>
        </div>
    `;
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

  // Add outside click listener
  setTimeout(() => {
    document.addEventListener('click', closeFormOnOutsideClick);
  }, 0);
}

function hideForm() {
  const form = document.getElementById('formContainer');
  form.classList.remove('show');

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
    
    // Get form elements by ID
    let nameInput = document.getElementById('contactName');
    let emailInput = document.getElementById('contactEmail');
    let phoneInput = document.getElementById('contactPhone');
    
    let contact = {
        "name": nameInput.value,
        "email": emailInput.value,
        "phone": phoneInput.value
    };
    contacts.push(contact);
    console.log(contacts);
    
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    
    renderContacts();
    hideForm();
}

function updateFormAvatar() {
    const name = document.getElementById("contactName").value.trim();
    const avatar = document.getElementById("formAvatar");
    if (!name) {
      avatar.textContent = "AA";
      return;
    }
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    avatar.textContent = initials;
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
