function getExpirationTs(expiresInMs = 60000) {
  const nowMs = new Date().getTime()
  const expirationMs = nowMs + expiresInMs
  return expirationMs
}

function getProtocol() {
  return process.env.NODE_ENV === 'prod' ? 'https' : 'http'
}

const isProduction = process.env.NODE_ENV === "production"

module.exports = { getExpirationTs, getProtocol, isProduction }