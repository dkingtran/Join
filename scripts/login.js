

/**
 * Smooth page intro animation:
 * Shrinks logo, fades out white overlay, shows main content after 1.1s, and removes intro after 1.4s
 */
window.addEventListener('load', () => {
  const logo = document.getElementById('logo');
  const intro = document.getElementById('intro');
  const overlay = document.getElementById('whiteOverlay');
  const mainContent = document.getElementById('mainContent');
  logo.classList.add('shrink');
  overlay.style.opacity = '0';
  setTimeout(() => {
    mainContent.classList.remove('d-none'); 
  }, 1100);                                  
  setTimeout(() => {
    intro.remove(); 
  }, 1400);                           
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

