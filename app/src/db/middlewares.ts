import contextService from "request-context";
import { capitalizeFirstLetter } from "../utils/helpers";

const addDepartmentScope = (schema) => {
  schema.pre(/^find/, async function (next) {
    const { isAdmin } = contextService.get("request:user") || {};
    const department = contextService.get("request:department") || {};
    if (!department) {
      return next();
    }

    isAdmin ? this.find() : this.find({ department });
    next();
  });
};

const addCenterFilter = (schema) => {
  schema.pre(/^find/, function (next) {
    const { center } = contextService.get("request:user")|| {};
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

export { addCenterFilter, addResponsable, capitalizeFields, addDepartmentScope };
