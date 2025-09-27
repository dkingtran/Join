function toggleProfileDropdown() {
    const dropdown = document.getElementById('dropdown-profile');
    dropdown.classList.toggle('show');
}

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

function handleDocumentClick(event) {
    const profileContainer = document.getElementById('container-profile');
    const profileDropdown = document.getElementById('dropdown-profile');

    if (profileDropdown && profileContainer && !profileContainer.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
}
document.onclick = handleDocumentClick;

function initDesktopHover() {
    if (window.innerWidth >= 1000) {
    }
}

window.addEventListener('resize', initDesktopHover);

/**
 * logs out user and redirects to login.
 */
function logout() {
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("name");
    window.location.href = "./index.html";
}