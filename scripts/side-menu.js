function toggleProfileDropdown() {
    const dropdown = document.getElementById('dropdown-profile');
    dropdown.classList.toggle('show');
}

// Function to update profile button with user initials
function updateProfileInitials(userName) {
    const profileBtns = document.querySelectorAll('.profile-btn');
    const initials = getInitials(userName);
    
    profileBtns.forEach(btn => {
        btn.textContent = initials;
        
        // Add or remove single-initial class based on initials length
        if (initials.length === 1) {
            btn.classList.add('single-initial');
        } else {
            btn.classList.remove('single-initial');
        }
    });
}

// Initialize profile initials when page loads
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('name'));
    updateProfileInitials(currentUser);
    document.getElementById('logout-btn').addEventListener('click', logout);
});

// Close dropdown when clicking outside
function handleDocumentClick(event) {
    const profileContainer = document.getElementById('container-profile');
    const profileDropdown = document.getElementById('dropdown-profile');
    
    if (profileDropdown && profileContainer && !profileContainer.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
}
document.onclick = handleDocumentClick;

// Add desktop-specific hover handling if needed
function initDesktopHover() {
  if (window.innerWidth >= 1000) {
    // Desktop hover effects are handled by CSS
    // Additional JavaScript hover logic can be added here if needed
  }
}

// Call on window resize to handle responsive behavior
window.addEventListener('resize', initDesktopHover);

/**
 * logs out user and redirects to login.
 */
function logout() {
  localStorage.setItem("loggedIn", false);
  localStorage.removeItem("name");
  window.location.href = "./index.html";
}