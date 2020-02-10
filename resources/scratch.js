
function getEnv(v) {
    return 2;
}

function getConnectionLimit(variable) {
    const defaultLimit = 10;
    const value = getEnv(variable);
    if (value === undefined) return defaultLimit;
    let limit = parseInt(value);
    return limit >= 1 ? limit : defaultLimit; //Limit cant be less than 1 or NAN.
}

console.log(getConnectionLimit());