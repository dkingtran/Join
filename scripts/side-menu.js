function toggleHelpDropdown() {
    const dropdown = document.getElementById('helpDropdown');
    dropdown.classList.toggle('show');
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
function handleDocumentClick(event) {
    const profileContainer = document.getElementById('profileContainer');
    const profileDropdown = document.getElementById('profileDropdown');
    const helpContainer = document.getElementById('helpContainer');
    const helpDropdown = document.getElementById('helpDropdown');
    
    if (profileDropdown && profileContainer && !profileContainer.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
    
    if (helpDropdown && helpContainer && !helpContainer.contains(event.target)) {
        helpDropdown.classList.remove('show');
    }
}
document.onclick = handleDocumentClick;
