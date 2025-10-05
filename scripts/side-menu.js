/**
 * Toggles the visibility of the profile dropdown menu.
 */
function toggleProfileDropdown() {
    const dropdown = document.getElementById('dropdown-profile');
    dropdown.classList.toggle('show');
}

/**
 * Updates the profile button with the user's initials.
 * @param {string} userName - The full name of the user.
 */
function updateProfileInitials(userName) {
    const profileBtns = document.querySelectorAll('.profile-btn');
    const initials = getInitials(userName);

    profileBtns.forEach(btn => {
        btn.textContent = initials;

        if (initials.length === 1) {
            btn.classList.add('single-initial');
        } else {
            btn.classList.remove('single-initial');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('name'));
    updateProfileInitials(currentUser);
    document.getElementById('logout-btn').addEventListener('click', logout);
});

/**
 * Handles document clicks to close the profile dropdown if clicked outside.
 * @param {Event} event - The click event.
 */
function handleDocumentClick(event) {
    const profileContainer = document.getElementById('container-profile');
    const profileDropdown = document.getElementById('dropdown-profile');

    if (profileDropdown && profileContainer && !profileContainer.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
}
document.onclick = handleDocumentClick;

/**
 * Initializes desktop hover effects for the side menu (currently empty).
 */
function initDesktopHover() {
    if (window.innerWidth >= 1000) {
    }
}

window.addEventListener('resize', initDesktopHover);

/**
 * Logs out the user and redirects to the login page.
 */
function logout() {
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("name");
    window.location.href = "./index.html";
}