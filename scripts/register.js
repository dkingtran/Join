
const nameRef = document.getElementById('name');
const passwordConfirmationRef = document.getElementById('password-confirmation');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const passwordConLockIcon = document.getElementById('lock-confirm-password');
const passwordConVisibilityOffIcon = document.getElementById('visibility-off-confirm-password');
const passwordConVisibilityOnIcon = document.getElementById('visibility-on-confirm-password');
const passwordConfirmationWrapperRef = document.getElementById('password-confirmation-wrapper');

let emailCheck = false;
let nameCheck = false;
let passwordCheck = false;
let passwordConfirmationCheck = false;


/**
 * waits for the boolean from checkRegisterForm()
 * if true fetches users from Firebase
 * creates new user and adds it to the downloaded user array
 * uploads new user array
 * redirects to login
 * if false shows error message
 */
async function addUser() {
  if (checkRegisterForm()) {
    let users = await loadData("/users/");
    let newUser = {
      "name": nameRef.value,
      "email": emailRef.value,
      "password": passwordRef.value,
    };
    users.push(newUser);
    await putData("/users/", users);
    // showSuccess();
    redirectToLogin();
  } else {
    showErrorMessage();
  }
}

/**
 * sets timeout for redirection to login
 */
function redirectToLogin() {
  setTimeout(() => window.location.href = 'index.html', 2000);
}


/**
 * Executes the functions for the register-form inputs
 * @returns true if all inputs have been checked and validated
 */
function checkRegisterForm() {
  checkName();
  checkEmail();
  checkPassword();
  checkPasswordConfirmation();
  if (emailCheck && nameCheck && passwordCheck && passwordConfirmationCheck) {
    return true;
  } else return false;
}

/**
 * shows error message
 */
function showErrorMessage() {
  errorMessageRef.classList.add('show');
}


/**
 * lets error message dissapear when all input fields have been corrected
 */
document.getElementById('login-form').addEventListener("input", () => {
  if (emailCheck && nameCheck && passwordCheck && passwordConfirmationCheck) {
    errorMessageRef.classList.remove('show');
  }
});


/**
 * checks if name input is empty
 * if empty adds error class to input and nameCheck = false
 * if valid nameCheck = true
 */
function checkName() {
  if (!(nameRef.value == '')) {
    nameCheck = true;
  } else {
    nameRef.parentElement.classList.add('error');
    nameCheck = false;
  }
}


/**
 * eventlistener removes error class if name has been edited
 * nameCheck = true
 */
nameRef.addEventListener("input", () => {
  nameRef.parentElement.classList.remove('error');
  nameCheck = true;
});


/**
 * checks if email input has valid email adress
 * adds error class if not valid and emailCheck = false
 * if valid emailCheck = true
 */
function checkEmail() {
  if (emailRegex.test(emailRef.value)) {
    emailCheck = true;
  } else {
    emailRef.parentElement.classList.add('error');
    emailCheck = false;
  }
}


/**
 * eventlistener removes error class if email has been edited
 * emailCheck = true
 */
emailRef.addEventListener("input", () => {
  emailRef.parentElement.classList.remove('error');
  emailCheck = true;
});


/**
 * checks if password input is empty
 * if empty adds error class to input and passwordCheck = false
 * if valid passwordCheck = true
 */
function checkPassword() {
  if (!(passwordRef.value == '')) {
    passwordCheck = true;
  } else {
    passwordRef.parentElement.classList.add('error');
    passwordCheck = false;
  }
}


/**
 * eventlistener removes error class if password has been edited
 * passwordCheck = true
 */
passwordRef.addEventListener("input", () => {
  passwordRef.parentElement.classList.remove('error');
  passwordCheck = true;
});


/**
 * checks if password confirmation input is not empty and matches password input
 * if valid passwordConfirmationCheck = true
 * if not adds error class to input and sets passwordConfirmationCheck = false
 */
function checkPasswordConfirmation() {
  if (!(passwordConfirmationRef.value == '') && passwordRef.value == passwordConfirmationRef.value) {
    passwordConfirmationCheck = true;
  } else {
    passwordConfirmationRef.parentElement.classList.add('error');
    passwordConfirmationCheck = false;
  }
}


/**
 * eventlistener removes error class if password confirmation has been edited
 * passwordConfirmationCheck = true
 */
passwordConfirmationRef.addEventListener("input", () => {
  passwordConfirmationRef.parentElement.classList.remove('error');
  passwordConfirmationCheck = true;
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
 * eventlistener on focus password-confirmation-input 
 * changes lock-icon to the visibility-off-icon
 */
passwordConfirmationRef.addEventListener("focus", () => {
  passwordConLockIcon.classList.add('d-none');
  passwordConVisibilityOffIcon.classList.remove('d-none');
});


/**
 * eventlistener on password-conformation-input-wrapper
 * stops propagation from input-wrapper to login-form
 */
passwordConfirmationWrapperRef.addEventListener("click", (event) => {
  event.stopPropagation();
})


/**
 * eventlistener click on login-form
 * changes password-confirmation-input icon mach to lock
 * makes password not visible
 */
loginForm.addEventListener("click", () => {
    passwordConLockIcon.classList.remove('d-none');
    passwordConfirmationRef.type = "password";
    passwordConVisibilityOffIcon.classList.add('d-none');
    passwordConVisibilityOnIcon.classList.add('d-none');
});


/**
 * eventlistener click on visibility-off-icon
 * changes icon to visibility-on-icon
 * makes password confirmation visible
 */
passwordConVisibilityOffIcon.addEventListener("click", () => {
    passwordConfirmationRef.type = "text";
    passwordConVisibilityOffIcon.classList.add('d-none');
    passwordConVisibilityOnIcon.classList.remove('d-none');
});


/**
 * eventlistener click on visibility-oon-icon
 * changes icon to visibility-off-icon
 * makes password confirmation not visible
 */
passwordConVisibilityOnIcon.addEventListener("click", () => {
    passwordConfirmationRef.type = "password";
    passwordConVisibilityOnIcon.classList.add('d-none');
    passwordConVisibilityOffIcon.classList.remove('d-none');
});