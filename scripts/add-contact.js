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

    // Sortiere Kontakte alphabetisch nach Name
    let sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    // Gruppiere nach Anfangsbuchstaben
    let grouped = {};
    sorted.forEach(contact => {
        let letter = contact.name.charAt(0).toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(contact);
    });

    let contactIndex = 0;
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
            contactItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
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

/**
 * Shows the form container
 */
function showForm() {
    document.getElementById('formContainer').style.display = 'block';
}

/**
 * Hides the form container
 */
function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
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


/**
 * * Cancels the form by clearing the input fields.
 */
function cancelForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    hideForm();
}
