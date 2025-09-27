
const BASE_URL = "https://join-f4dc9-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * @function 
 * executes the GET operation with the given path.
 * 
 * @param {string} path - string added to the BASE_URL to access correct directory.
 * @param {object} data - the object that should be used with the method in this function.
 * @returns response from the operation as a JSON data.
 */
async function loadData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        return responseToJson = await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

/**
 * @function 
 * executes the POST operation with the given path.
 * 
 * @param {string} path - string added to the BASE_URL to access correct directory.
 * @param {object} data - the object that should be used with the method in this function.
 * @returns response from the operation as a JSON data.
 */
async function postData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return responseToJson = await response.json();
    } catch (error) {
        console.error("Post error:", error);
    }
}

/**
 * @function 
 * executes the DELETE operation with the given path.
 * 
 * @param {string} path - string added to the BASE_URL to access correct directory.
 * @returns response from the operation as a JSON data.
 */
async function deleteData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE"
        });
        return responseToJson = await response.json();
    } catch (error) {
        console.error("Delete error:", error);
    }
}

/**
 * @function 
 * executes the PUT operation with the given path.
 * 
 * @param {string} path - string added to the BASE_URL to access correct directory.
 * @param {object} data - the object that should be used with the method in this function.
 * @returns response from the operation as a JSON data.
 */
async function putData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return responseToJson = await response.json();
    } catch (error) {
        console.error("Put error:", error);
    }
}

/**
 * Adds an 'id' property to a Firebase object using the provided idObject's name,
 * then updates the object at the specified path in Firebase.
 *
 * @async
 * @function
 * @param {Object} idObject - The object containing the 'name' property to use as the ID.
 * @param {string} path - The base path in Firebase where the object is stored.
 * @returns {Promise<void>} Resolves when the object has been updated in Firebase.
 */
async function addIdToObject(idObject, path) {
  let objectPath = path + idObject.name + "/";
  let firebaseObject = await loadData(objectPath);
  firebaseObject["id"] = idObject.name;
  await putData(objectPath, firebaseObject);
}