
const emailRef = document.getElementById('email');
const passwordRef = document.getElementById('password');
const passwordLockIcon = document.getElementById('lock-password');
const passwordVisibilityOffIcon = document.getElementById('visibility-off-password');
const passwordVisibilityOnIcon = document.getElementById('visibility-on-password');
const passwordWrapperRef = document.getElementById('password-wrapper');
const errorMessageRef = document.getElementById('error-msg');
const loginForm = document.getElementById('login-form');


/**
 * eventlistener on focus password-input 
 * changes lock-icon to the visibility-off-icon
 */
passwordRef.addEventListener("focus", () => {
    passwordLockIcon.classList.add('d-none');
    passwordVisibilityOffIcon.classList.remove('d-none');
});


/**
 * eventlistener on password-input-wrapper
 * stops propagation from input-wrapper to login-form
 */
passwordWrapperRef.addEventListener("click", (event) => {
    event.stopPropagation();
})


/**
 * eventlistener click on login-form
 * changes password-input icon mach to lock
 * makes password not visible
 */
loginForm.addEventListener("click", () => {
    passwordLockIcon.classList.remove('d-none');
    passwordRef.type = "password";
    passwordVisibilityOffIcon.classList.add('d-none');
    passwordVisibilityOnIcon.classList.add('d-none');
});


/**
 * eventlistener click on visibility-off-icon
 * changes icon to visibility-on-icon
 * makes password visible
 */
passwordVisibilityOffIcon.addEventListener("click", () => {
    passwordRef.type = "text";
    passwordVisibilityOffIcon.classList.add('d-none');
    passwordVisibilityOnIcon.classList.remove('d-none');
});


/**
 * eventlistener click on visibility-oon-icon
 * changes icon to visibility-off-icon
 * makes password not visible
 */
passwordVisibilityOnIcon.addEventListener("click", () => {
    passwordRef.type = "password";
    passwordVisibilityOnIcon.classList.add('d-none');
    passwordVisibilityOffIcon.classList.remove('d-none');
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