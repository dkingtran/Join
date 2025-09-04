
const categories = { 0: "to-do", 1: "in-progress", 2: "feedback", 3: "done" };

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

function debounce(cb, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => cb(...args), delay);
    };
};

function getInitials(name) {
    let nameArray = name.split(" ");
    let firstNameInitial = nameArray[0].toUpperCase().slice(0, 1);
    let lastNameInitial = nameArray[nameArray.length - 1].toUpperCase().slice(0, 1);
    if (nameArray.length == 1) {
        return firstNameInitial;
    }
    return firstNameInitial + lastNameInitial;
}