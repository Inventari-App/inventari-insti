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

const isProduction = process.env.NODE_ENV === "production"

module.exports = { getExpirationTs, getProtocol, isProduction, localizeBoolean, capitalize }
