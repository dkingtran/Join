
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorMsg = document.getElementById("error-msg");


/**
 * handles login submit
 * downloads users from firebase
 * compares login data and looks for matches
 * if match login successful
 * else displayLoginError()
 */
async function login() {
  let users = await loadData("/users/");
  let user = users.find(user => user.email === emailRef.value && user.password === passwordRef.value);
  if (user) {
    window.location.href = "../index.html";
  } else {
    displayLoginError();
  }
  emailRef.value = '';
  passwordRef.value = '';
}


/**
 * displays error on wrong input
 */
function displayLoginError() {
  emailRef.parentElement.classList.add("error");
  passwordRef.parentElement.classList.add("error");
  errorMessageRef.classList.add("show");
}


/** 
const urlParams = new URLSearchParams(window.location.search); // animation from down comformation login is good
const message = urlParams.get('message');

if (message) {
  msgBox.innerHTML = message;
} else {
  msgBox.style.display = 'none';
}
*/

