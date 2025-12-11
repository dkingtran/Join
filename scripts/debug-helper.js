/**
 * Toggles between the "Limit OK" and "Limit Reached" views for debugging purposes.
 * This function is intended for development use only.
 */
function toggleLimitView() {
    const limitOk = document.getElementById('limit-ok-container');
    const limitReached = document.getElementById('limit-reached-container');

    if (limitOk.classList.contains('d-none')) {
        limitOk.classList.remove('d-none');
        limitReached.classList.add('d-none');
    } else {
        limitOk.classList.add('d-none');
        limitReached.classList.remove('d-none');
    }
}