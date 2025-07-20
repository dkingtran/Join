
const loginForm = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');

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


function displayLoginError() {
    let errorMessage = document.getElementById('error-message');
    errorMessage.innerText = "Invalid. Please check your E-Mail or Password";
    loginForm.classList.add('failure');
    setTimeout(() => {
        loginForm.classList.remove('failure');
    }, 2000);
}


const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

if (message) {
    msgBox.innerHTML = message;
} else {
    msgBox.style.display = 'none';
}


