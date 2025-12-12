// animation-logo.js

/**
 * Retrieves all necessary DOM elements for the animation
 * @returns {Object} Object containing logo, overlay, mainContent, and intro elements
 */
function getElements() {
  return {
    logo: document.getElementById('logo'),
    overlay: document.getElementById('whiteOverlay'),
    mainContent: document.getElementById('mainContent'),
    intro: document.getElementById('intro')
  };
}

/**
 * Shows main content and positions logo without animation
 * @param {HTMLElement} mainContent - The main content wrapper element
 * @param {HTMLElement} logo - The logo image element
 */
function showContent(mainContent, logo) {
  if (mainContent) {
    mainContent.classList.remove('hidden');
    mainContent.style.opacity = '1';
  }
  if (logo) {
    logo.style.transition = 'none';
    logo.classList.add('shrink');
    logo.classList.remove('initial-hidden');
  }
}

/**
 * Starts the logo shrink and fade animation
 * @param {HTMLElement} logo - The logo image element
 * @param {HTMLElement} overlay - The white overlay element
 * @param {HTMLElement} mainContent - The main content wrapper element
 */
function playAnimation(logo, overlay, mainContent) {
  mainContent.classList.remove('hidden');
  logo.classList.remove('initial-hidden');

  // Ensure overlay is visible initially
  overlay.style.opacity = '1';

  setTimeout(() => {
    logo.classList.add('shrink');
    overlay.style.opacity = '0';
    mainContent.style.opacity = '1';
  }, 1000);
}

/**
 * Removes intro elements and marks animation as complete
 * @param {HTMLElement} intro - The intro container element
 * @param {HTMLElement} logo - The logo image element
 */
function cleanupAnimation(intro, logo) {
  setTimeout(() => {
    intro.remove();
    logo.style.transition = 'none';
    // sessionStorage.setItem('animationPlayed', 'true');
  }, 2600);
}

/**
 * Skips animation and shows content immediately on return visits
 */
function skipAnimation() {
  const { intro, mainContent, logo } = getElements();
  if (intro) intro.remove();
  showContent(mainContent, logo);
}

/**
 * Handles the first visit with full animation or skip if no intro exists
 */
function handleFirstVisit() {
  const { logo, overlay, mainContent, intro } = getElements();
  if (intro && overlay) {
    playAnimation(logo, overlay, mainContent);
    cleanupAnimation(intro, logo);
  } else {
    showContent(mainContent, logo);
    // sessionStorage.setItem('animationPlayed', 'true');
  }
}
// if (!sessionStorage.getItem('animationPlayed')) {
window.addEventListener('load', handleFirstVisit);
// } else {
//   window.addEventListener('load', skipAnimation);
// }