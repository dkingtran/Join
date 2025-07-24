const emailRef = document.getElementById('email');
const nameRef = document.getElementById('name');
const passwordRef = document.getElementById('password');
const passwordConfirmationRef = document.getElementById('password-confirmation');
const errorMessageRef = document.getElementById('error-msg');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/gi;

async function addUser() {
  if (checkName() & checkEmail() & checkPassword()) {
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

function showErrorMessage() {
  errorMessageRef.classList.add('show');
  setTimeout(() => {
    errorMessageRef.classList.remove('show');
  }, 3000)
}

function checkName() {
  if (!(nameRef.value == '')) {
    return true;
  } else {
    nameRef.parentElement.classList.add('error');
    return false;
  }
}

nameRef.addEventListener("input", () => {
  nameRef.parentElement.classList.remove('error');
});

function checkEmail() {
  if (emailRegex.test(emailRef.value)) {
    return true;
  } else {
    emailRef.parentElement.classList.add('error');
    return false;
  }
}

emailRef.addEventListener("input", () => {
  emailRef.parentElement.classList.remove('error');
});

function checkPassword() {
  if (!(passwordRef.value == '') && passwordRef.value == passwordConfirmationRef.value) {
    return true;
  } else {
    passwordRef.parentElement.classList.add('error');
    passwordConfirmationRef.parentElement.classList.add('error');
  }
}

passwordRef.addEventListener("input", () => {
  passwordRef.parentElement.classList.remove('error');
});

passwordConfirmationRef.addEventListener("input", () => {
  passwordConfirmationRef.parentElement.classList.remove('error');
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
