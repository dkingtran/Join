
const emailRef = document.getElementById('email');
const nameRef = document.getElementById('name');
const passwordRef = document.getElementById('password');
const passwordConfirmationRef = document.getElementById('password-confirmation');
const emailRegex = /^[a-z]+\s[a-z]+$/gi;


async function addUser() {
    if (checkName() && checkEmail() && checkPassword()) {
        let users = await loadData("/users/");
        let newUser = {
            "name": nameRef.value,
            "email": emailRef.value,
            "password": passwordRef.value,
        }
        users.push(newUser);
        await putData("/users/", users);
        window.location.href = 'login.html?message=Registration successful';
    } else return false;
}


function checkName() {
    if (!(nameRef.value == '')) {
        return true;
    } else {
        nameRef.classList.add('failure');
        return false;
    }
}


function checkEmail() {
    if (emailRegex.test(emailRef.value)) {
        return true;
    } else {
        emailRef.classList.add('failure');
        return false;
    }
}


function checkPassword() {
    if (!(passwordRef.value == '') && passwordRef.value == passwordConfirmationRef.value) {
        return true;
    } else {
        passwordRef.classList.add('failure');
        passwordConfirmationRef.classList.add('failure');
    }
}


document.getElementById('privacy-policy-check').addEventListener("onclick", (event) => {
    let isChecked = event.target.checked;
    let signUpBtn = document.getElementById('sign-up-btn');
    if (isChecked) {
        signUpBtn.disabled = false;
    } else {
        signUpBtn.disabled = true;
    }
});
