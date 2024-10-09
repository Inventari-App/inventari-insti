export function getExpirationTs(expiresInMs = 10 * 60 * 1000) {
    const nowMs = new Date().getTime();
    const expirationMs = nowMs + expiresInMs;
    return expirationMs;
}
export function getProtocol() {
    return process.env.NODE_ENV === 'prod' ? 'https' : 'http';
}
export function localizeBoolean(val) {
    return val ? "Si" : "No";
}
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function twoDecimals(val) {
    try {
        return parseFloat(val).toFixed(2);
    }
    catch (_a) {
        return val;
    }
}
export function capitalizeFirstLetter(str) {
    if (str.length === 0)
        return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export function sortByKey(items, key) {
    try {
        return items.sort((a, b) => a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1);
    }
    catch (_a) {
        return items;
    }
}
export const isProduction = process.env.NODE_ENV === "production";
