
const loginForm = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');

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

/**
 * Login form validation on submit
 * - Prevents the default form submission
 * - Checks if either email or password is missing
 * - Displays an error message if one of the fields is empty
 * - Highlights the problematic fields with an "error" class
 * - Clears previous error states before validation
 */
document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[type="email"]');
  const pass = form.querySelector('input[type="password"]');
  const err = document.getElementById("error-msg");
  [email, pass].forEach(input => input.parentElement.classList.remove("error"));
  err.classList.remove("show");
  if ((email.value && !pass.value) || (!email.value && pass.value)) {
    [email, pass].forEach(input => input.parentElement.classList.add("error"));
    err.classList.add("show");
  }
});


const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

if (message) {
    msgBox.innerHTML = message;
} else {
    msgBox.style.display = 'none';
}


