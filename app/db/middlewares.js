const contextService = require("request-context")

const addCenterFilter = (schema) => {
  schema.pre(/^find/, function (next) {
    const { center } = contextService.get('request:user') || {}
    if (!center) {
      return next()
    }

    this.find({ center })
    next()
  })
}

module.exports = { addCenterFilter }
