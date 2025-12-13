/**
 * @fileoverview Client-side logic for handling n8n stakeholder requests and modal interactions.
 * This script manages the user flow for stakeholders, checks daily API usage limits via Firebase,
 * and sends requests to the n8n webhook.
 */

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/create-request"; // Replace with production URL later

/**
 * Gets the current date as a string in YYYY-MM-DD format.
 * Used for generating the daily key for Firebase usage tracking.
 * 
 * @returns {string} The current date (e.g., "2023-12-11").
 */
function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Opens the Stakeholder flow.
 * Checks the daily usage limit in Firebase before deciding which view to show.
 * If the limit (10) is reached, shows the fallback view.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function openStakeholderFlow(checkLimit = false) {
    const roleModal = document.getElementById('role-selection-modal');
    const stakeholderModal = document.getElementById('stakeholder-modal');
    const staticLogo = document.querySelector('.logo-static');

    if (roleModal) roleModal.classList.add('d-none');
    if (stakeholderModal) stakeholderModal.classList.remove('d-none');
    if (staticLogo) staticLogo.classList.add('d-none'); // Hide static logo

    if (!checkLimit) return; // Skip Firebase check if not requested

    const today = getTodayDateString();
    const path = `/api_usage/${today}/count`;

    try {
        // Uses the existing loadData function from firebase.js
        let countData = await loadData(path);

        // Handle case where countData is an object (e.g. { "-N...": 5 } or { count: 5 })
        let count = 0;
        if (typeof countData === 'number') {
            count = countData;
        } else if (typeof countData === 'string') {
            count = parseInt(countData, 10) || 0;
        } else if (typeof countData === 'object' && countData !== null) {
            // Try to find the first numeric value
            const values = Object.values(countData);
            if (values.length > 0 && typeof values[0] === 'number') {
                count = values[0];
            }
        }

        const limitOkContainer = document.getElementById('limit-ok-container');
        const limitReachedContainer = document.getElementById('limit-reached-container');

        if (count >= 10) {
            // Limit reached
            if (limitOkContainer) limitOkContainer.classList.add('d-none');
            if (limitReachedContainer) limitReachedContainer.classList.remove('d-none');
        } else {
            // Limit OK
            if (limitOkContainer) limitOkContainer.classList.remove('d-none');
            if (limitReachedContainer) limitReachedContainer.classList.add('d-none');
        }

        // Update counter display
        const counterElement = document.getElementById('request-count');
        if (counterElement) counterElement.innerText = count;

    } catch (error) {
        console.error("Error checking API usage:", error);
        // Fallback to safe state (maybe show manual email if check fails)
    }
}

/**
 * Closes the modal and proceeds to the normal login screen.
 */
function closeModalAndLogin() {
    const roleModal = document.getElementById('role-selection-modal');
    const logo = document.getElementById('logo');
    const staticLogo = document.querySelector('.logo-static');

    if (roleModal) roleModal.classList.add('d-none');
    if (logo) logo.classList.remove('d-none');
    if (staticLogo) staticLogo.classList.remove('d-none'); // Show static logo
    // The login form is already visible on the main page underneath
}

/**
 * Handles the click on the mailto link.
 * Instead of counting locally, we let n8n do the counting when the email is actually received.
 * This function simply redirects the user back to the login screen after a short delay.
 */
function handleEmailClick() {
    // Wait 2 seconds (while mail client opens), then go back to login
    setTimeout(() => {
        location.reload(); // Reloads page to reset state
    }, 2000);
}

/**
 * Initializes the landing page logic.
 * Shows the role selection modal after the logo animation finishes.
 */
function initLandingPage() {
    // Wait for logo animation (approx 1-2 seconds based on CSS)
    setTimeout(() => {
        const roleModal = document.getElementById('role-selection-modal');
        const logo = document.getElementById('logo');
        if (roleModal) roleModal.classList.remove('d-none');
        if (logo) logo.classList.add('d-none');
    }, 2500); // Adjust timing to match your animation-logo.js
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initLandingPage);
