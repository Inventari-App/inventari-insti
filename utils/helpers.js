module.exports = { getExpirationTs }

function getExpirationTs(expiresInMs = 60000) {
  const nowMs = new Date().getTime()
  const expirationMs = nowMs + expiresInMs
  return expirationMs
}