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

const isProduction = process.env.NODE_ENV === "production"

module.exports = { getExpirationTs, getProtocol, isProduction, localizeBoolean }
