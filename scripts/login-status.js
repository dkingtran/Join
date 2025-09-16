

if (!localStorage.getItem("loggedIn")) {
    window.location.href = "./index.html";
}


/**
 * Updates the #userName element with the logged-in user's name.
 * - Reads login state and name from localStorage.
 * - If both are valid, parses and displays the stored name.
 * - Otherwise logs an error and sets a fallback message.
 */
function showUserNameOnly() {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const localStorageName = localStorage.getItem("name");
  if (isLoggedIn && localStorageName) {
    document.getElementById("userName").textContent = JSON.parse(localStorageName);
  } else {
    console.error("Kein gültiger Name im Login gefunden: loggedIn =", isLoggedIn, "name =", localStorageName);
  }
}

document.addEventListener("DOMContentLoaded", showUserNameOnly);




