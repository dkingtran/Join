
const passwordLockIcon = document.getElementById('lock-password');
const passwordVisibilityOffIcon = document.getElementById('visibility-off-password');
const passwordVisibilityOnIcon = document.getElementById('visibility-on-password');
const passwordWrapperRef = document.getElementById('password-wrapper');

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
 * Plays the intro animation with logo shrink and overlay fade
 * @param {HTMLElement} logo - The logo image element
 * @param {HTMLElement} overlay - The white overlay element
 * @param {HTMLElement} mainContent - The main content wrapper element
 * @param {HTMLElement} intro - The intro container element
 */
function playIntroAnimation(logo, overlay, mainContent, intro) {
  mainContent.classList.remove('hidden');
  requestAnimationFrame(() => {
    logo.classList.add('shrink');
    overlay.style.opacity = '0';
    mainContent.style.opacity = '1';
  });
  setTimeout(() => {
    intro.remove();
  }, 1600);
}

/**
 * Shows content without animation (for pages without intro)
 * @param {HTMLElement} mainContent - The main content wrapper element
 */
function showContentDirectly(mainContent) {
  if (mainContent) {
    mainContent.classList.remove('hidden');
    mainContent.style.opacity = '1';
  }
}

window.addEventListener('load', () => {
  const logo = document.getElementById('logo');
  const overlay = document.getElementById('whiteOverlay');
  const mainContent = document.getElementById('mainContent');
  const intro = document.getElementById('intro');
  
  if (intro && overlay) {
    playIntroAnimation(logo, overlay, mainContent, intro);
  } else {
    showContentDirectly(mainContent);
  }
});