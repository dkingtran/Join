
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

/**
 * Validates the login form on submit.
 * @param {SubmitEvent} event – The event triggered when the form is submitted.
 * Steps:
 * 1. Prevents the form from submitting and reloading the page.
 * 2. Removes any previous error styling from the input fields.
 * 3. Checks if the email or password fields are empty.
 * 4. If either field is empty:
 *    - Adds an "error" class to both input wrappers (e.g., red border),
 *    - Shows the error message below the form.
 */
document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();
  email.parentElement.classList.remove("error");
  password.parentElement.classList.remove("error");
  errorMsg.classList.remove("show");
  if (!email.value || !password.value) {
    email.parentElement.classList.add("error");
    password.parentElement.classList.add("error");
    errorMsg.classList.add("show");
  }
});



// function displayLoginError() {
//     let errorMessage = document.getElementById('error-message');
//     errorMessage.innerText = "Invalid. Please check your E-Mail or Password";
//     loginForm.classList.add('failure');
//     setTimeout(() => {
//         loginForm.classList.remove('failure');
//     }, 2000);
// }


const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

if (message) {
  msgBox.innerHTML = message;
} else {
  msgBox.style.display = 'none';
}


