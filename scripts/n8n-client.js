/**
 * @fileoverview Client-side logic for handling n8n stakeholder requests and modal interactions.
 * This script manages the user flow for stakeholders, checks daily API usage limits via Firebase,
 * and sends requests to the n8n webhook.
 */

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/create-request"; // Replace with production URL later

let hasInteracted = false; // Flag to prevent modal from reopening after user interaction

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
 * Handles modal visibility for stakeholder flow.
 */
function handleModals() {
    const roleModal = document.getElementById('role-selection-modal');
    const stakeholderModal = document.getElementById('stakeholder-modal');
    const staticLogo = document.querySelector('.logo-static');
    if (roleModal) roleModal.classList.add('d-none');
    if (stakeholderModal) stakeholderModal.classList.remove('d-none');
    if (staticLogo) staticLogo.classList.add('d-none');
}

/**
 * Checks daily usage limit and updates UI accordingly.
 * @async
 */
async function checkUsageLimit() {
    const today = getTodayDateString();
    const path = `/api_usage/${today}/count`;
    try {
        let countData = await loadData(path);
        let count = 0;
        if (typeof countData === 'number') count = countData;
        else if (typeof countData === 'string') count = parseInt(countData, 10) || 0;
        else if (typeof countData === 'object' && countData !== null) {
            const values = Object.values(countData);
            if (values.length > 0 && typeof values[0] === 'number') count = values[0];
        }
        const limitOk = document.getElementById('limit-ok-container');
        const limitReached = document.getElementById('limit-reached-container');
        if (count >= 10) {
            if (limitOk) limitOk.classList.add('d-none');
            if (limitReached) limitReached.classList.remove('d-none');
        } else {
            if (limitOk) limitOk.classList.remove('d-none');
            if (limitReached) limitReached.classList.add('d-none');
        }
        const counter = document.getElementById('request-count');
        if (counter) counter.innerText = count;
    } catch (error) {
        console.error("Error checking API usage:", error);
    }
}

/**
 * Opens the Stakeholder flow.
 * @async
 */
async function openStakeholderFlow(checkLimit = false) {
    hasInteracted = true; // Prevent modal from reopening
    handleModals();
    if (checkLimit) await checkUsageLimit();
}

/**
 * Closes the modal and proceeds to the normal login screen.
 */
function closeModalAndLogin() {
    hasInteracted = true; // Prevent modal from reopening
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
 * Increases the request counter locally and updates Firebase immediately, then lets n8n handle further logic.
 * Shows a confirmation message instead of reloading.
 */
async function handleEmailClick() {
    try {
        // Get current count from Firebase
        const today = getTodayDateString();
        const path = `api_usage/${today}`;
        const currentData = await loadData(path);
        let currentCount = 0;
        if (typeof currentData === 'object' && currentData !== null && typeof currentData.count === 'number') {
            currentCount = currentData.count;
        } else if (typeof currentData === 'number') {
            currentCount = currentData;
        }

        // Increase count
        const newCount = currentCount + 1;

        // Update Firebase
        await putData(path, { count: newCount });

        // Update display immediately
        const counter = document.getElementById('request-count');
        if (counter) counter.innerText = newCount;

        // Check if limit reached
        if (newCount >= 10) {
            const limitOk = document.getElementById('limit-ok-container');
            const limitReached = document.getElementById('limit-reached-container');
            if (limitOk) limitOk.classList.add('d-none');
            if (limitReached) limitReached.classList.remove('d-none');
        }

        // maybe show confirmation message
    } catch (error) {
        console.error("Error updating request count:", error);
    }
}

/**
 * Initializes the landing page logic.
 * Shows the role selection modal after the logo animation finishes.
 */
function initLandingPage() {
    // Wait for logo animation (approx 1-2 seconds based on CSS)
    setTimeout(() => {
        if (!hasInteracted) { // Only show modal if user hasn't interacted yet
            const roleModal = document.getElementById('role-selection-modal');
            const logo = document.getElementById('logo');
            if (roleModal) roleModal.classList.remove('d-none');
            if (logo) logo.classList.add('d-none');
        }
    }, 2500); // Adjust timing to match your animation-logo.js
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initLandingPage);
