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




function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email === email.value && u.password === password.value);
    console.log(user);
    if (user) {
        console.log('User found');
    }
}
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

if (message) {
  msgBox.innerHTML = message;
} else {
    msgBox.style.display = 'none';  // error here Leo
} 

