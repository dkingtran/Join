
const categories = { 0: "triage", 1: "to-do", 2: "in-progress", 3: "feedback", 4: "done" };

/**
 * @param {String} takes String. 
 * @returns String with whitespaces removed.
 */
function removeSpaces(string) {
    return string.replace(/\s/gm, '');
}

/**
 * @param {string} string - The input string from which hyphens will be removed.
 * @returns {string} The string with all hyphens removed.
 */
function removeHyphens(string) {
    return string.replace(/-/gm, '');
}

/**
 * @param {String} 
 * @returns String with first Char capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Returns a random color from the global `colors` array.
 * The color is selected by generating a random index between 0 and 14.
 *
 * @returns {*} A randomly selected color from the `colors` array.
 */
function getRandomColor() {
    let colorIndex = Math.floor(Math.random() * 15);
    return colors[colorIndex];
}

/**
 * Creates a debounced version of the provided function that delays its execution until after a specified delay has elapsed since the last time it was invoked.
 *
 * @param {Function} cb - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} A debounced version of the input function.
 */
function debounce(cb, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => cb(...args), delay);
    };
};

/**
 * Returns the initials of a given name.
 * If the name consists of a single word, returns the first letter of that word.
 * If the name consists of multiple words, returns the first letter of the first and last words.
 *
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials in uppercase.
 */
function getInitials(name) {
    let nameArray = name.split(" ");
    let firstNameInitial = nameArray[0].toUpperCase().slice(0, 1);
    let lastNameInitial = nameArray[nameArray.length - 1].toUpperCase().slice(0, 1);
    if (nameArray.length == 1) {
        return firstNameInitial;
    }
    return firstNameInitial + lastNameInitial;
}