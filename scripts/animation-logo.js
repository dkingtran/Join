// animation-logo.js
if (!sessionStorage.getItem('animationPlayed')) {
  window.addEventListener('load', () => {
    const logo = document.getElementById('logo');
    const overlay = document.getElementById('whiteOverlay');
    const mainContent = document.getElementById('mainContent');
    const intro = document.getElementById('intro');
    
    // Nur auf Login-Seite animieren (wo intro existiert)
    if (intro && overlay) {
      mainContent.classList.remove('hidden');
      logo.classList.remove('initial-hidden'); // Logo sichtbar machen
      
      requestAnimationFrame(() => {
        logo.classList.add('shrink');
        overlay.style.opacity = '0';
        mainContent.style.opacity = '1';
      });
      
      setTimeout(() => {
        intro.remove();
        logo.style.transition = 'none';
        sessionStorage.setItem('animationPlayed', 'true');
      }, 1600);
    } else {
      // Register-Seite oder keine Intro
      if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '1';
      }
      if (logo) {
        logo.style.transition = 'none';
        logo.classList.add('shrink');
        logo.classList.remove('initial-hidden');
      }
      sessionStorage.setItem('animationPlayed', 'true');
    }
  });
} else {
  // Animation überspringen - Logo direkt oben links OHNE Transition
  const intro = document.getElementById('intro');
  const mainContent = document.getElementById('mainContent');
  const logo = document.getElementById('logo');
  
  if (intro) intro.remove();
  if (mainContent) {
    mainContent.classList.remove('hidden');
    mainContent.style.opacity = '1';
  }
  if (logo) {
    logo.style.transition = 'none';
    logo.classList.add('shrink');
    logo.classList.remove('initial-hidden'); // Logo sichtbar machen
  }
}