const loginForm = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorMsg = document.getElementById("error-msg");



async function login() {
  loginForm.preventDefault();
  let users = await loadData("/users/");
  let user = users.find(user => user.email === email.value && user.password === password.value);
  if (user) {
    window.location.href = "../index.html";
  } else {
    displayLoginError();
  }
  email.value = '';
  password.value = '';
}


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


loginForm.addEventListener("submit", displayLoginError);
/**
 * Handles login form submission
 * - Prevents default behavior
 * - Resets previous error styles
 * - Validates input fields and shows error if needed
 */
function displayLoginError(event) {
  event.preventDefault();
  email.parentElement.classList.remove("error");
  password.parentElement.classList.remove("error");
  errorMsg.classList.remove("show");

  validateLoginInputs(email, password, errorMsg);
}


/**
 * Validates the email and password input fields and applies visual error feedback if needed.
 * @param {HTMLInputElement} email - The email input field.
 * @param {HTMLInputElement} password - The password input field.
 * @param {HTMLElement} errorMsg - The error message element to be displayed.
 * @description
 * Checks whether one or both fields are empty (after trimming whitespace).
 * If invalid, adds the "error" class to the parent wrapper of each field
 * and reveals the error message element.
 */
function validateLoginInputs(email, password, errorMsg) {
  if (!email.value.trim() || !password.value.trim()) {
    email.parentElement.classList.add("error");
    password.parentElement.classList.add("error");
    errorMsg.classList.add("show");
  }
}




 const urlParams = new URLSearchParams(window.location.search); // animation from 
const message = urlParams.get('message');

if (message) {
  msgBox.innerHTML = message;
} else {
  msgBox.style.display = 'none';
}

 
