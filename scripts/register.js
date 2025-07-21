const nameSignUp = document.getElementById("name-sign-up");
const emailSignUp = document.getElementById("email-sign-up");
const passwordSignUp = document.getElementById("password-sign-up");
const confirmPassword = document.getElementById("confirm-password");
const  errorMsgSignUp = document.getElementById("error-msg");
const checkbox = document.getElementById("checkbox-sign-up");

// In validateRegisterInputs() hinzufügen:
if (!checkbox.checked) {
  errorMsgSignUp.textContent = "Please accept the privacy policy.";
  errorMsgSignUp.classList.add("show");
  checkbox.parentElement.classList.add("error");
  valid = false;
}


let users = [
    {'email': 'test@example.com', 'password': 'password123'}
]

 function addUser() {
  users.push({ email: emailSignUp.value, password: passwordSignUp.value }); // Change by ME
  window.location.href = 'login.html?message=Registration successful';
}
 

document.getElementById("login-form").addEventListener("submit", handleRegister);
/**
 * Handles the register form submission
 * - Prevents default
 * - Resets old errors
 * - Validates all fields
 * - Calls addUser() if all inputs are valid
 */
function handleRegister(event) {
  event.preventDefault();
  resetRegisterStyles([nameSignUp, emailSignUp, passwordSignUp, confirmPassword], errorMsg);
  if (!validateRegisterInputs(nameSignUp, emailSignUp, passwordSignUp, confirmPassword, errorMsg)) return;
  addUser();
}

/**
 * Removes previous error styles from the input fields and hides the error message.
 * 
 * @param {HTMLElement[]} inputs - Array of input elements (name, email, password, confirmPassword)
 * @param {HTMLElement} errorMsg - The element displaying the global error message
 */
function resetRegisterStyles(inputs, errorMsgSignUp) {
  inputs.forEach(input => input.parentElement.classList.remove("error"));
  errorMsgSignUp.classList.remove("show");
}
/**
 * Validates that all fields are filled and that the password and confirmation match.
 * If validation fails, it applies the "error" class and shows the error message.
 * 
 * @param {HTMLElement} name - The name input field
 * @param {HTMLElement} email - The email input field
 * @param {HTMLElement} password - The password input field
 * @param {HTMLElement} confirmPassword - The confirmation password input field
 * @param {HTMLElement} errorMsg - The element displaying the global error message
 * @returns {boolean} - Returns true if all inputs are valid, otherwise false
 */

function validateRegisterInputs(name, email, password, confirmPassword, errorMsgSignUp) {
  let valid = true;
  if (!name.value || !email.value || !password.value || !confirmPassword.value || password.value !== confirmPassword.value) {
    [name, email, password, confirmPassword].forEach(input => {
      if (!input.value || (input === confirmPassword && password.value !== confirmPassword.value)) {
        input.parentElement.classList.add("error");
      }
    });

    errorMsgSignUp.textContent = "Please fill all fields correctly. Passwords must match.";
   errorMsgSignUp.classList.add("show");
    valid = false;
  }
  return valid;
}