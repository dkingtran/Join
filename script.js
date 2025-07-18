let contacts = [];



function init() {
    // Initialize the page - don't call addToContacts() here

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
}


/**
 * * Cancels the form by clearing the input fields.
 */
function cancelForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

