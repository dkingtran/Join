
/**
 * @param {String} takes String. 
 * @returns String with whitespaces removed.
 */
function removeSpaces(string) {
    return string.replace(/\s+/gm, '');
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