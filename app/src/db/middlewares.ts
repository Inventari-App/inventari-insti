import contextService from "request-context";
import { capitalizeFirstLetter } from "../utils/helpers";
import { Schema } from "mongoose";
import { Document } from 'mongoose';

export interface DocumentWithFields extends Document {
  [key: string]: any;
}

const addDepartmentScope = (schema: Schema) => {
  schema.pre(/^find/, async function (next) {
    const { isAdmin } = contextService.get("request:user") || {};
    const department = contextService.get("request:department") || {};
    if (!department) {
      return next();
    }

    if (isAdmin) {
      this.find();
    } else {
      this.find({ department });
    }
    next();
  });
};

const addCenterFilter = (schema: Schema) => {
  schema.pre(/^find/, function (next) {
    const { center } = contextService.get("request:user") || {};
    if (!center) {
      return next();
    }

    this.find({ center });
    next();
  });
};

const addResponsable = (schema: Schema) => {
  schema.pre("save", async function (next) {
    if (!this.responsable) {
      // Assuming you have a way to get the current user's id (replace with your logic)
      const user = contextService.get("request:user") || {};
      this.responsable = user.id;
    }
    next();
  });
};

const capitalizeFields = (fields: string[]) => {
  return function (this: DocumentWithFields, next: () => void) {
    fields.forEach((field) => {
      if (!this[field]) return;
      this[field] = capitalizeFirstLetter(this[field]);
    });
    next();
  };
};

export {
  addCenterFilter,
  addResponsable,
  capitalizeFields,
  addDepartmentScope,
};
