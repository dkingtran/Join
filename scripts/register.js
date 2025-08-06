
const passwordConLockIcon = document.getElementById('lock-confirm-password');
const passwordConVisibilityOffIcon = document.getElementById('visibility-off-confirm-password');
const passwordConVisibilityOnIcon = document.getElementById('visibility-on-confirm-password');
const passwordConWrapperRef = document.getElementById('password-confirmation-wrapper');

let nameIsValid = false;
let emailIsValid = false;
let passwordIsValid = false;
let passwordConIsValid = false;

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
    showErrorMessage();
  } else if (await checkForUserDuplicate(emailRef.value)) {
    showErrorMessage();
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
function checkRegisterForm() {
  nameIsValid = nameCheck(nameRef.value);
  emailIsValid = emailCheck(emailRef.value);
  passwordIsValid = passwordCheck(passwordRef.value);
  passwordConIsValid = passwordConCheck(passwordRef.value, passwordConRef.value);
  return emailIsValid && nameIsValid && passwordIsValid && passwordConIsValid;
}

/**
 * Adds an 'error' class to the parent element of the specified input reference if the input is invalid.
 *
 * @param {string} inputRef - The reference name of the input field ('name', 'email', 'password', or 'passwordCon').
 * @param {boolean} isValid - Indicates whether the input is valid.
 */
function showInputError(inputRef, isValid) {
  if (!isValid) {
    switch (inputRef) {
      case "name":
        nameRef.parentElement.classList.add('error');
        break;
      case "email":
        emailRef.parentElement.classList.add('error');
        break;
      case "password":
        passwordRef.parentElement.classList.add('error');
        break;
      case "passwordCon":
        passwordConRef.parentElement.classList.add('error');
        break;
    }
  }
}

/**
 * Displays error messages for the registration form fields by validating each input
 * (name, email, password, and password confirmation) and showing corresponding error styles.
 * Also makes the general error message visible.
 *
 * Assumes the existence of validation flags (nameIsValid, emailIsValid, passwordIsValid, passwordConIsValid)
 * and a reference to the error message element (errorMessageRef).
 */
function showErrorMessage() {
  showInputError("name", nameIsValid);
  showInputError("email", emailIsValid);
  showInputError("password", passwordIsValid);
  showInputError("passwordCon", passwordConIsValid);
  errorMessageRef.classList.add('show');
}

/**
 * lets error message disappear when all input fields have been corrected
 */
document.getElementById('login-form').addEventListener("input", () => {
  if (emailIsValid && nameIsValid && passwordIsValid && passwordConIsValid) {
    errorMessageRef.classList.remove('show');
  }
});

/**
 * eventlistener removes error class if name has been edited
 * nameIsVaild = true
 */
nameRef.addEventListener("input", () => {
  nameRef.parentElement.classList.remove('error');
  nameIsValid = true;
});

/**
 * eventlistener removes error class if email has been edited
 * emailIsValid = true
 */
emailRef.addEventListener("input", () => {
  emailRef.parentElement.classList.remove('error');
  emailIsValid = true;
});

/**
 * eventlistener removes error class if password has been edited
 * passwordIsValid = true
 */
passwordRef.addEventListener("input", () => {
  passwordRef.parentElement.classList.remove('error');
  passwordIsValid = true;
});

/**
 * eventlistener removes error class if password confirmation has been edited
 * passwordConIsValid = true
 */
passwordConRef.addEventListener("input", () => {
  passwordConRef.parentElement.classList.remove('error');
  passwordConIsValid = true;
});

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