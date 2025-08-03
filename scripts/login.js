
nameRef = document.getElementById('name');
emailRef = document.getElementById('email');
passwordRef = document.getElementById('password');

/**
 * Handles login submit.
 * Downloads users from firebase.
 * If match login successful.
 * Else displayLoginError().
 */
async function login() {
  let users = await loadData("/users/");
  let user = findUser(users);
  if (user) {
    activateLogin(user);
    window.location.href = "./index.html";
  } else {
    displayLoginError();
  }
  emailRef.value = '';
  passwordRef.value = '';
}

/**
 * Displays error on wrong input.
 */
function displayLoginError() {
  emailRef.parentElement.classList.add("error");
  passwordRef.parentElement.classList.add("error");
  errorMessageRef.classList.add("show");
}

/**
 * Finds and returns a user object from the provided array that matches the email and password input values.
 * @param {Array<Object>} users - The array of user objects to search through.
 * @returns {Object|undefined} The matched user object if found; otherwise, undefined.
 */
function findUser(users) {
  let userKeyArray = Object.keys(users);
  let userId =  userKeyArray.find(userKey => {
    return users[userKey] &&
      users[userKey].email === emailRef.value &&
      users[userKey].password == passwordRef.value;
  });
  return users[userId];
}

/**
 * Activates the loggedIn state for a user by storing login status and user name in localStorage.
 *
 * @param {Object} user - The user object containing user information.
 * @param {string} user.name - The name of the user to be stored.
 */
function activateLogin(user) {
  localStorage.setItem("loggedIn", true);
  localStorage.setItem("name", JSON.stringify(user.name));
}