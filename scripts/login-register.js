
const passwordRef = document.getElementById('password');
const passwordLockIcon = document.getElementById('lock-password');
const passwordVisibilityOffIcon = document.getElementById('visibility-off-password');
const passwordVisibilityOnIcon = document.getElementById('visibility-on-password');
const passwordWrapperRef = document.getElementById('password-wrapper');
const loginForm = document.getElementById('login-form');


/**
 * eventlistener on focus password-input 
 * changes lock-icon to the visibility-off-icon
 */
passwordRef.addEventListener("focus", () => {
    passwordLockIcon.classList.add('d-none');
    passwordVisibilityOffIcon.classList.remove('d-none');
});


/**
 * eventlistener on password-input-wrapper
 * stops propagation from input-wrapper to login-form
 */
passwordWrapperRef.addEventListener("click", (event) => {
    event.stopPropagation();
})


/**
 * eventlistener click on login-form
 * changes password-input icon mach to lock
 * makes password not visible
 */
loginForm.addEventListener("click", () => {
    passwordLockIcon.classList.remove('d-none');
    passwordRef.type = "password";
    passwordVisibilityOffIcon.classList.add('d-none');
    passwordVisibilityOnIcon.classList.add('d-none');
});


/**
 * eventlistener click on visibility-off-icon
 * changes icon to visibility-on-icon
 * makes password visible
 */
passwordVisibilityOffIcon.addEventListener("click", () => {
    passwordRef.type = "text";
    passwordVisibilityOffIcon.classList.add('d-none');
    passwordVisibilityOnIcon.classList.remove('d-none');
});


/**
 * eventlistener click on visibility-oon-icon
 * changes icon to visibility-off-icon
 * makes password not visible
 */
passwordVisibilityOnIcon.addEventListener("click", () => {
    passwordRef.type = "password";
    passwordVisibilityOnIcon.classList.add('d-none');
    passwordVisibilityOffIcon.classList.remove('d-none');
});