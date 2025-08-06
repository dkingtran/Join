let nameRef;
let emailRef;
let passwordRef;
let passwordConRef;

const firstNameRegex = /^[a-z]+\s/gi;
const lastNameRegex = /\s[a-z]+$/gi;
const lettersRegex = /^[a-z]+$/gi;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@\d]+$/gi;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/;


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

function dateCheck(date) {
    if(removeSpaces(date) == "") return false;
    let dateInput = new Date(date);
    let dateNow = new Date();
    if (dateInput < dateNow) return false;
    else return true;
}


function titleCheck(title) {
    if(removeSpaces(title) == "") return false;
    else return true;
}

