"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = void 0;
exports.getExpirationTs = getExpirationTs;
exports.getProtocol = getProtocol;
exports.localizeBoolean = localizeBoolean;
exports.capitalize = capitalize;
exports.twoDecimals = twoDecimals;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.sortByKey = sortByKey;
function getExpirationTs(expiresInMs = 10 * 60 * 1000) {
    const nowMs = new Date().getTime();
    const expirationMs = nowMs + expiresInMs;
    return expirationMs;
}
function getProtocol() {
    return process.env.NODE_ENV === 'prod' ? 'https' : 'http';
}
function localizeBoolean(val) {
    return val ? "Si" : "No";
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function twoDecimals(val) {
    try {
        return parseFloat(val).toFixed(2);
    }
    catch (_a) {
        return val;
    }
}
function capitalizeFirstLetter(str) {
    if (str.length === 0)
        return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function sortByKey(items, key) {
    try {
        return items.sort((a, b) => a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1);
    }
    catch (_a) {
        return items;
    }
}
exports.isProduction = process.env.NODE_ENV === "production";
//# sourceMappingURL=helpers.js.map