function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

// Function to generate user initials from full name
function generateInitials(fullName) {
    if (!fullName) return 'G'; // Default for 'User'
    
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
    }
    
    // Take first letter of first name and first letter of last name
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts[nameParts.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
}

// Function to update profile button with user initials
function updateProfileInitials(userName = 'Guest') {
    const profileBtns = document.querySelectorAll('.profile-btn');
    const initials = generateInitials(userName);
    
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
document.addEventListener('DOMContentLoaded', function() {
    // You can replace this with actual user data from your authentication system
    const currentUser = 'Guest'; // This should come from your user session/login data
    updateProfileInitials(currentUser);
});

// Close dropdown when clicking outside
function handleDocumentClick(event) {
    const profileContainer = document.getElementById('profileContainer');
    const profileDropdown = document.getElementById('profileDropdown');
    
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
