/**
 * Generates the HTML template for the mobile edit dropdown with Edit and Delete buttons for a contact.
 * 
 * @param {number} idx - The index of the contact to be edited or deleted.
 * @returns {string} The HTML string for the mobile edit dropdown.
 */
function getMobileEditDropdownTemplate(idx) {
    return `
        <button class="edit-btn" onclick="openContactForm('edit', ${idx}); removeMobileEditDropdown(); event.stopPropagation();">
            <img src="assets/img/icons/add-contact/edit.svg">
            Edit</button>
        <button class="delete-btn" onclick="getIdToDelete(${idx}); removeMobileEditDropdown(); event.stopPropagation();">
            <img src="assets/img/icons/add-contact/delete.svg">
            Delete</button>
    `;
}

/**
 * Generates an HTML template for a contact group header based on the provided letter.
 * 
 * @param {string} letter - The letter representing the contact group.
 * @returns {string} The HTML string for the contact group header.
 */
function getGroupTemplate(letter) {
    return `
        <div class="contact-group-letter">${letter}</div>
        <hr class="contact-divider">
    `;
}

/**
 * Generates an HTML template string for a contact list item.
 * 
 * @param {Object} contact - The contact object containing user details.
 * @param {string} colorClass - The CSS class for the contact avatar's background color.
 * @param {string} initials - The initials to display in the contact avatar.
 * @param {number} contactIndex - The index of the contact in the list.
 * @returns {string} The HTML string representing the contact list item.
 */
function getContactListItemTemplate(contact, colorClass, initials, contactIndex) {
    return `
        <div class="contact-item" data-index="${contactIndex}">
            <div class="contact-avatar ${colorClass}">${initials}</div>
            <div class="contact-item-content">
                <div class="contact-name">${contact.name["first-name"]} ${contact.name["last-name"]}</div>
                <div class="contact-email">${contact.email}</div>
            </div>
        </div>
    `;
}

/**
 * Generates an HTML template string for displaying detailed contact information.
 *
 * @param {Object} contact - The contact object containing user details.
 * @param {string} colorClass - The CSS class for the contact avatar background color.
 * @param {string} initials - The initials to display in the contact avatar.
 * @param {number} idx - The index of the contact in the contact list.
 * @returns {string} The HTML template string for the contact details view.
 */
function getContactDetailsTemplate(contact, colorClass, initials, idx) {
    return `
        <div class="contact-details">
            <div class="contact-details-top">
                <div class="contact-avatar-clicked display-standard ${colorClass}">${initials}</div>
                <div class="contact-name-edit-delete">
                    <div class="contact-name-clicked">${contact.name["first-name"]} ${contact.name["last-name"]}</div>
                    <div class="contact-details-actions">
                        <button class="edit-btn" onclick="openContactForm('edit', ${idx})"><img src="assets/img/icons/add-contact/edit.svg">Edit</button>
                        <button class="delete-btn" onclick="getIdToDelete(${idx})"><img src="assets/img/icons/add-contact/delete.svg">Delete</button>
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
                    <div class="contact-details-info-phone">${contact["phone-number"]}</div>
                </div>
            </div>
        </div>
    `;
}