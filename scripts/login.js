

nameRef = document.getElementById('name');
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
  return users.find(user => {
    return user &&
      user.email === emailRef.value &&
      user.password == passwordRef.value;
  });
}