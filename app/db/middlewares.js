const contextService = require("request-context");
const { capitalizeFirstLetter } = require("../utils/helpers");

const addCenterFilter = (schema) => {
  schema.pre(/^find/, function (next) {
    const { center } = contextService.get("request:user") || {};
    if (!center) {
      return next();
    }

    this.find({ center });
    next();
  });
};

const addResponsable = (schema) => {
  schema.pre("save", async function (next) {
    if (!this.responsable) {
      // Assuming you have a way to get the current user's id (replace with your logic)
      const user = contextService.get("request:user") || {};
      this.responsable = user.id;
    }
    next();
  });
};

const capitalizeFields = (fields) => {
  return function(next) {
    fields.forEach(field => {
      if (!this[field]) return;
      this[field] = capitalizeFirstLetter(this[field])
    });
    next();
  };
}

module.exports = { addCenterFilter, addResponsable, capitalizeFields };
