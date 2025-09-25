let nameRef;
let emailRef;
let passwordRef;
let passwordConRef;
let phoneRef;

const firstNameRegex = /^[a-z]+\s/i;
const lastNameRegex = /\s[a-z]+$/i;
const lettersRegex = /^[a-z]+$/i;
const numbersRegex = /^[0-9]+$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@\d]+$/i;
const phoneNumberRegex = /^(\+[1-9]{2})?[0-9]+$/m;

/**
 * @param {string} string - string to remove whitespaces.
 * @returns string with all whitespaces removed.
 */
function removeSpaces(string) {
    return string.replace(/\s+/gm, '');
}

/**
 * Validates a given name string based on specific regex patterns.
 * Tests if name is empty, has first and last name and has no numbers.
 * @param {string} name - The name to validate.
 * @returns {boolean} Returns true if the name passes all validation checks, otherwise false.
 */
function nameCheck(name) {
    if (removeSpaces(name) == "") return false;
    else if (!(firstNameRegex.test(name) && lastNameRegex.test(name))) return false;
    else if (!(lettersRegex.test(removeSpaces(name)))) return false;
    else return true;
}

/**
 * Checks if the provided email is valid.
 * Tests if email is empty and has a valid email-form.
 * @param {string} email - The email address to validate.
 * @returns {boolean} Returns true if the email is valid, otherwise false.
 */
function emailCheck(email) {
    if (removeSpaces(email) == "") return false;
    else if (!(emailRegex.test(email))) return false;
    else return true;
}

/**
 * Checks if the provided password is not an empty string after trimming whitespace.
 * @param {string} password - The password string to check.
 * @returns {boolean} Returns false if the trimmed password is an empty string, otherwise returns true.
 */
function passwordCheck(password) {
    if (removeSpaces(password) == "") return false;
    else return true;
}

/**
 * Checks if the password confirmation matches the original password and is not empty.
 * @param {string} password - The original password.
 * @param {string} passwordCon - The password confirmation to check.
 * @returns {boolean} Returns true if the confirmation is not empty and matches the password, otherwise false.
 */
function passwordConCheck(password, passwordCon) {
    if ((removeSpaces(passwordCon) == "") || !(password == passwordCon)) return false;
    else return true;
}

/**
 * Generates an object containing the first name(s) and last name from a full name string.
 * Capitalizes the first letter of each word.
 * @returns generated Object.
 */
function generateNameObject(name) {
    let parts = name.trim().split(/\s+/);
    parts = parts.map(word => capitalizeFirstLetter(word));
    let lastName = parts.pop();
    let firstName = parts.join(' ');
    return {
        "first-name": firstName,
        "last-name": lastName
    };
}

/**
 * Checks if the provided date string is valid and represents a future date.
 *
 * @param {string} date - The date string to check.
 * @returns {boolean} Returns true if the date is not empty and is in the future, otherwise false.
 */

/**
 * Checks if the provided date string represents a valid date that is today or in the future.
 *
 * @param {string} date - The date string to validate.
 * @returns {boolean} Returns true if the date is valid and not in the past, otherwise false.
 */
function dateCheck(date) {
    if (removeSpaces(date) === "") return false;
    let dateInput = new Date(date);
    let dateNow = new Date();
    if (isNaN(dateInput.getTime())) return false;
    dateInput.setHours(0,0,0,0);
    dateNow.setHours(0,0,0,0);
    return dateInput >= dateNow; 
}

/**
 * Checks if the given title string is not empty after removing all spaces.
 *
 * @param {string} title - The title string to check.
 * @returns {boolean} Returns true if the title is not empty after removing spaces, otherwise false.
 */
function titleCheck(title) {
    if (removeSpaces(title) == "") return false;
    else return true;
}

/**
 * Validates a phone number by checking if it is not empty (after removing spaces)
 * and matches the expected phone number format using a regular expression.
 *
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {boolean} Returns true if the phone number is valid, otherwise false.
 */
function phoneNumberCheck(phoneNumber) {
    if (removeSpaces(phoneNumber) == "") return false;
    else if (!(phoneNumberRegex.test(clearPhoneNumber(phoneNumber)))) return false;
    else return true;
}

/**
 * Removes spaces and hyphens from the given phone number string.
 *
 * @param {string} phoneNumber - The phone number to be cleaned.
 * @returns {string} The phone number with spaces and hyphens removed.
 */
function clearPhoneNumber(phoneNumber) {
    return removeHyphens(removeSpaces(phoneNumber));
}

/**
 * Formats a phone number by clearing unwanted characters, converting a leading '0' to '+49',
 * and inserting spaces for readability.
 *
 * @param {string} phoneNumber - The input phone number to format.
 * @returns {string} The formatted phone number.
 */
function phoneNumberForm(phoneNumber) {
    let phoneNumberClear = clearPhoneNumber(phoneNumber);
    if (phoneNumberClear.charAt(0) == "0") {
        phoneNumberClear = phoneNumberClear.replace(/^0/, "+49");
    }
    return phoneNumberClear.slice(0, 3) + " " + phoneNumberClear.slice(3, 7) + " " + phoneNumberClear.slice(7);
}