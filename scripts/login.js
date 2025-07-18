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
    msgBox.style.display = 'none';
}

