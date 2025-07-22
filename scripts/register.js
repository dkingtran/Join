
const emailRef = document.getElementById('email');
const nameRef = document.getElementById('name');
const passwordRef = document.getElementById('password');
const passwordConfirmationRef = document.getElementById('password-confirmation');
const errorMessageRef = document.getElementById('error-msg');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

let emailCheck = false;
let nameCheck = false;
let passwordCheck = false;
let passwordConfirmationCheck = false;


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
    window.location.href = 'login.html?message=Registration successful';
  } else {
    showErrorMessage();
    return false;
  }
}


function checkRegisterForm() {
  checkName();
  checkEmail();
  checkPassword();
  checkPasswordConfirmation();
  if (emailCheck && nameCheck && passwordCheck && passwordConfirmationCheck) {
    return true;
  } else return false;
}


function showErrorMessage() {
  errorMessageRef.classList.add('show');
}

document.getElementById('login-form').addEventListener("input", () => {
  if (emailCheck && nameCheck && passwordCheck && passwordConfirmationCheck) {
    errorMessageRef.classList.remove('show');
  }
});


function checkName() {
  if (!(nameRef.value == '')) {
    nameCheck = true;
  } else {
    nameRef.parentElement.classList.add('error');
    nameCheck = false;
  }
}


nameRef.addEventListener("input", () => {
  nameRef.parentElement.classList.remove('error');
  nameCheck = true;
});


function checkEmail() {
  if (emailRegex.test(emailRef.value)) {
    emailCheck = true;
  } else {
    emailRef.parentElement.classList.add('error');
    emailCheck = false;
  }
}


emailRef.addEventListener("input", () => {
  emailRef.parentElement.classList.remove('error');
  emailCheck = true;
});


function checkPassword() {
  if (!(passwordRef.value == '')) {
    passwordCheck = true;
  } else {
    passwordRef.parentElement.classList.add('error');
    passwordCheck = false;
  }
}


passwordRef.addEventListener("input", () => {
  passwordRef.parentElement.classList.remove('error');
  passwordCheck = true;
});


function checkPasswordConfirmation() {
  if (!(passwordConfirmationRef.value == '') && passwordRef.value == passwordConfirmationRef.value) {
    passwordConfirmationCheck = true;
  } else {
    passwordConfirmationRef.parentElement.classList.add('error');
    passwordConfirmationCheck = false;
  }
}


passwordConfirmationRef.addEventListener("input", () => {
  passwordConfirmationRef.parentElement.classList.remove('error');
  passwordConfirmationCheck = true;
});


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
 * Handles smooth intro animation on page load:
 * - Shrinks the logo into the top corner
 * - Fades out the white overlay simultaneously
 * - Gradually reveals the main content
 * - Removes the intro element after the transition
 */
window.addEventListener('load', () => {
  const logo = document.getElementById('logo');
  const overlay = document.getElementById('whiteOverlay');
  const mainContent = document.getElementById('mainContent');
  const intro = document.getElementById('intro');
  mainContent.classList.remove('hidden');
  requestAnimationFrame(() => {
    logo.classList.add('shrink');
    overlay.style.opacity = '0';
    mainContent.style.opacity = '1';
  });
  setTimeout(() => {
    intro.remove();
  }, 1600);
});
