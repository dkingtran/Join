
const passwordLockIcon = document.getElementById('lock-password');
const passwordVisibilityOffIcon = document.getElementById('visibility-off-password');
const passwordVisibilityOnIcon = document.getElementById('visibility-on-password');
const passwordWrapperRef = document.getElementById('password-wrapper');
const errorMessageRef = document.getElementById('error-msg');

/**
 * Eventlistener on focus password-input.
 * Changes lock-icon to the visibility-off-icon.
 */
passwordRef.addEventListener("focus", () => {
  if (passwordVisibilityOnIcon.classList.contains('d-none')) {
    passwordLockIcon.classList.add('d-none');
    passwordVisibilityOffIcon.classList.remove('d-none');
  }
});

/**
 * Click eventlistener on document.
 * Resets password visibility when clicking outside of input.
 */
document.addEventListener("click", event => {
  if (!passwordWrapperRef.contains(event.target)) {
    passwordLockIcon.classList.remove('d-none');
    passwordRef.type = "password";
    passwordVisibilityOffIcon.classList.add('d-none');
    passwordVisibilityOnIcon.classList.add('d-none');
  }
});

/**
 * Eventlistener click on visibility-off-icon.
 * Changes icon to visibility-on-icon.
 * Makes password visible.
 */
passwordVisibilityOffIcon.addEventListener("click", () => {
  passwordRef.type = "text";
  passwordVisibilityOffIcon.classList.add('d-none');
  passwordVisibilityOnIcon.classList.remove('d-none');
});

/**
 * Eventlistener click on visibility-oon-icon.
 * Changes icon to visibility-off-icon.
 * Makes password not visible.
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