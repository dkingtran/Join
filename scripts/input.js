
function removeSpaces(str) {
    return str.replace(/\s/g, "");
}

function dateCheck(date) {
    if(removeSpaces(date) == "") return false;
    let dateInput = new Date(date);
    let dateNow = new Date();
    if (dateInput < dateNow) return false;
    else return true;
}

function titleCheck(title) {
    if(removeSpaces(title) == "") return false;
    else return true;
}


