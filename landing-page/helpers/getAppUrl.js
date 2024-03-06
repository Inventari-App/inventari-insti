const isProduction = process.env.NODE_ENV === "prod"

function getAppUrl (site) {
  if (site == "landing") {
    return isProduction ? "https://controlamaterial.com" : "http://localhost:3001"
  }
  return isProduction ? "https://app.controlamaterial.com" : "http://localhost:3000"
}

module.exports = getAppUrl
