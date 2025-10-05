
const passwordConLockIcon = document.getElementById('lock-confirm-password');
const passwordConVisibilityOffIcon = document.getElementById('visibility-off-confirm-password');
const passwordConVisibilityOnIcon = document.getElementById('visibility-on-confirm-password');
const passwordConWrapperRef = document.getElementById('password-confirmation-wrapper');

nameRef = document.getElementById('name');
emailRef = document.getElementById('email');
passwordRef = document.getElementById('password');
passwordConRef = document.getElementById('password-confirmation');

/**
 * Waits for the boolean from checkRegisterForm().
 * If true fetches users from Firebase.
 * creates new user and adds it to the downloaded user array
 * uploads new user array
 * redirects to login
 * if false shows error message
 */
async function addUser() {
  if (!checkRegisterForm()) {
    return;
  } else {
    let contactId = await postData("/contacts/", generateContact());
    await addIdToObject(contactId, "/contacts/");
    let userId = await postData("/users/", generateUser());
    await addIdToObject(userId, "/users/");
    showSuccess();
  }
}

/**
 * Generates a contact object with email, name, phone number, and color properties.
 * @returns {Object} The generated contact object.
 */
function generateContact() {
  return {
    "email": emailRef.value,
    "name": generateNameObject(nameRef.value),
    "phone-number": "xxxx - xxxxx",
    "color": getRandomColor(),
  };
}

/**
 * Generates a user object containing email, name, and password properties.
 * @returns {Object} The generated user object.
 */
function generateUser() {
  return {
    "email": emailRef.value,
    "name": generateNameObject(nameRef.value),
    "password": passwordRef.value,
  };
}

/**
 * Checks if a user with the specified email already exists in the users data.
 *
 * @async
 * @function
 * @param {string} email - The email address to check for duplication.
 * @returns {Promise<boolean>} - Resolves to true if a user with the given email exists, otherwise false.
 */
async function checkForUserDuplicate(email) {
  let users = await loadData("/users/");
  let userKeyArray = Object.keys(users);
  return userKeyArray.some(userKey => {
    return users[userKey].email == email;
  });
}

/**
 * Validates the registration form fields by checking the validity of name, email, password, and password confirmation.
 * Updates error messages if any field is invalid.
 *
 * @returns {boolean} Returns true if all form fields are valid, otherwise false.
 */
async function checkRegisterForm() {
  return nameCheck() && await emailCheck() && passwordCheck() && confirmPasswordCheck();
}

/**
 * checks if privacy policy has been accepted
 * enables sign up button if it has been accepted
 * else sign up button stays disabled
 */
document.getElementById('privacy-policy-checkbox').addEventListener("click", (event) => {
  let isChecked = event.target.checked;
  let signUpBtn = document.getElementById('signup-btn');
  if (isChecked) {
    signUpBtn.disabled = false;
  } else {
    signUpBtn.disabled = true;
  }
});

/**
 * Displays the success message and toggles overlay.
 */
function showSuccess() {
  const confirmLoginDiv = document.getElementById('confirm-register');
  confirmLoginDiv.classList.remove('hide', 'fadeout');
  confirmLoginDiv.classList.add('show');
  toggleOverlay();
  redirectToLogin();
}

/**
 * Shows or hides the overlay based on the given boolean value.
 * @param {boolean} visible - true to show the overlay, false to hide it
 */
function toggleOverlay() {
  const overlay = document.getElementById('register-succ-overlay');
  overlay.classList.remove('hide');
  overlay.classList.add('show');
}

/**
 * sets timeout for redirection to login
 * and redirects to the login page after 2.5 seconds.
 */
function redirectToLogin() {
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

/**
 * eventlistener on focus password-confirmation-input 
 * changes lock-icon to the visibility-off-icon
 */
passwordConRef.addEventListener("focus", () => {
  if (passwordConVisibilityOnIcon.classList.contains('d-none')) {
    passwordConLockIcon.classList.add('d-none');
    passwordConVisibilityOffIcon.classList.remove('d-none');
  }
});

/**
 * eventlistener click on document
 * changes password-confirmation-input icon to lock
 * makes password not visible
 */
document.addEventListener("click", event => {
  if (!passwordConWrapperRef.contains(event.target)) {
    passwordConLockIcon.classList.remove('d-none');
    passwordConRef.type = "password";
    passwordConVisibilityOffIcon.classList.add('d-none');
    passwordConVisibilityOnIcon.classList.add('d-none');
  }
});

/**
 * eventlistener click on visibility-off-icon
 * changes icon to visibility-on-icon
 * makes password confirmation visible
 */
passwordConVisibilityOffIcon.addEventListener("click", () => {
  passwordConRef.type = "text";
  passwordConVisibilityOffIcon.classList.add('d-none');
  passwordConVisibilityOnIcon.classList.remove('d-none');
});

/**
 * eventlistener click on visibility-oon-icon
 * changes icon to visibility-off-icon
 * makes password confirmation not visible
 */
passwordConVisibilityOnIcon.addEventListener("click", () => {
  passwordConRef.type = "password";
  passwordConVisibilityOnIcon.classList.add('d-none');
  passwordConVisibilityOffIcon.classList.remove('d-none');
});

/**
 * Validates the value of the name input field using multiple checks:
 * - Checks if the name is not empty.
 * - Checks if the name contains both a first and last name.
 * - Checks if the name contains only valid letters.
 * Displays appropriate error messages for each validation failure.
 * @returns {boolean} Returns true if all checks pass, otherwise false.
 */
function nameCheck() {
  if (!emptyCheck(nameRef.value)) {
    showNameError("empty");
    return false;
  } else if (!firstLastNameCheck(nameRef.value)) {
    showNameError("first-last");
    return false;
  } else if (!letterCheck(nameRef.value)) {
    showNameError("letter");
    return false;
  } else {
    showNameError();
    return true;
  }
}

/**
 * Displays or hides the name error message based on the provided error type.
 * @param {string} [errorType=""] - The type of error to display. Possible values:
 *   - "empty": Name field is empty.
 *   - "first-last": First and last name are required.
 *   - "letter": Name can only contain letters.
 *   - Any other value will hide the error message.
 */
function showNameError(errorType = "") {
  let errorMsgRef = document.getElementById('name-error-msg');
  errorMsgRef.classList.add('show');
  nameRef.parentElement.classList.add('error');
  if (errorType == "empty") errorMsgRef.innerText = "Name can't be empty!";
  else if (errorType == "first-last") errorMsgRef.innerText = "First and last name required!";
  else if (errorType == "letter") errorMsgRef.innerText = "name can only have letters!";
  else {
    errorMsgRef.classList.remove('show');
    nameRef.parentElement.classList.remove('error');
  }
}

/**
 * adds eventlistener to the name input to check it on blur
 */
nameRef.addEventListener("blur", nameCheck);

/**
 * Checks the validity of the email input by performing the following checks:
 * 1. Ensures the email field is not empty.
 * 2. Validates the email format.
 * 3. Checks for duplicate email addresses in the user database.
 * Displays appropriate error messages for each failed check.
 * @async
 * @returns {Promise<boolean>} Returns true if the email passes all checks, otherwise false.
 */
async function emailCheck() {
  if (!emptyCheck(emailRef.value)) {
    showEmailError("empty");
    return false;
  } else if (!validEmailCheck(emailRef.value)) {
    showEmailError("validity");
    return false;
  } else if (await checkForUserDuplicate(emailRef.value)) {
    showEmailError("duplicate");
    return false;
  } else {
    showEmailError();
    return true;
  }
}

/**
 * Displays an email error message based on the specified error type.
 * @param {string} [errorType=""] - The type of email error. Possible values:
 *   - "empty": Email field is empty.
 *   - "validity": Email format is invalid.
 *   - "duplicate": Email is already in use.
 *   - Any other value will hide the error message.
 */
function showEmailError(errorType = "") {
  let errorMsgRef = document.getElementById('email-error-msg');
  errorMsgRef.classList.add('show');
  emailRef.parentElement.classList.add('error');
  if (errorType == "empty") errorMsgRef.innerText = "E-mail can't be empty!";
  else if (errorType == "validity") errorMsgRef.innerText = "Not a valid e-mail!";
  else if (errorType == "duplicate") errorMsgRef.innerText = "E-mail already in use!";
  else {
    errorMsgRef.classList.remove('show');
    emailRef.parentElement.classList.remove('error');
  }
}

/**
 * adds eventlistener to the e-mail input to check it on blur
 */
emailRef.addEventListener("blur", emailCheck);

/**
 * Validates the password input field.
 * Checks if the password is not empty.
 * Displays an error message if the password is empty.
 * @returns {boolean} Returns `true` if the password is not empty, otherwise `false`.
 */
function passwordCheck() {
  if (!emptyCheck(passwordRef.value)) {
    showPasswordError("empty");
    return false;
  } else {
    showPasswordError();
    return true;
  }
}

/**
 * Displays an password error message based on the specified error type.
 * @param {string} [errorType=""] - The type of password error. Possible values:
 *   - "empty": Password field is empty.
 *   - Any other value will hide the error message.
 */
function showPasswordError(errorType = "") {
  let errorMsgRef = document.getElementById('password-error-msg');
  errorMsgRef.classList.add('show');
  passwordRef.parentElement.classList.add('error');
  if (errorType == "empty") errorMsgRef.innerText = "Password can't be empty!";
  else {
    errorMsgRef.classList.remove('show');
    passwordRef.parentElement.classList.remove('error');
  }
}

/**
 * adds eventlistener to the password input to check it on blur
 */
passwordRef.addEventListener("blur", passwordCheck());

/**
 * Checks the validity of the confirm password input by performing the following checks:
 * 1. Ensures the password and confirm password are the same.
 * Displays appropriate error messages for each failed check.
 * @returns {Promise<boolean>} Returns true if the password confirmation passes all checks, otherwise false.
 */
function confirmPasswordCheck() {
  if (!passwordConCheck(passwordRef.value, passwordConRef.value)) {
    showConfirmPasswordError("not-conform");
    return false;
  } else {
    showConfirmPasswordError();
    return true;
  }
}

/**
 * Displays an password confirmation error message based on the specified error type.
 * @param {string} [errorType=""] - The type of password error. Possible values:
 *   - "not-conform": Password and password conformation arre not the same.
 *   - Any other value will hide the error message.
 */
function showConfirmPasswordError(errorType = "") {
  let errorMsgRef = document.getElementById('confirm-password-error-msg');
  errorMsgRef.classList.add('show');
  passwordConRef.parentElement.classList.add('error');
  if (errorType == "not-conform") errorMsgRef.innerText = "Passwords don't match!";
  else {
    errorMsgRef.classList.remove('show');
    passwordConRef.parentElement.classList.remove('error');
  }
}

/**
 * adds eventlistener to the password confirmation input to check it on blur
 */
passwordConRef.addEventListener("blur", confirmPasswordCheck());