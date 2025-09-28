
/**
 * Checks if the user is logged in by verifying the presence of the "loggedIn" item in localStorage.
 * If the user is not logged in, redirects to the login page.
 */
if (localStorage.getItem("loggedIn") == 'false') {
    window.location.href = "./index.html";
}