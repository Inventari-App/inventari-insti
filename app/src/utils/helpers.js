function getExpirationTs(expiresInMs = 10 * 60 * 1000) { // 10 mins
  const nowMs = new Date().getTime()
  const expirationMs = nowMs + expiresInMs
  return expirationMs
}

function getProtocol() {
  return process.env.NODE_ENV === 'prod' ? 'https' : 'http'
}

function localizeBoolean(val) {
  return val ? "Si" : "No"
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function twoDecimals(val) {
  try {
    return parseFloat(val).toFixed(2)
  } catch {
    return val
  }
}

function capitalizeFirstLetter(str) {
  if (str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function sortByKey(items, key) {
  try {
    return items.sort((a, b) => a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1)
  } catch (e) {
    return items
  }
}

const isProduction = process.env.NODE_ENV === "production"

module.exports = { getExpirationTs, capitalizeFirstLetter, getProtocol, isProduction, localizeBoolean, capitalize, twoDecimals, sortByKey }
