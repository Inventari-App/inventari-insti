var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import contextService from "request-context";
import { capitalizeFirstLetter } from "../utils/helpers";
const addDepartmentScope = (schema) => {
    schema.pre(/^find/, function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isAdmin } = contextService.get("request:user") || {};
            const department = contextService.get("request:department") || {};
            if (!department) {
                return next();
            }
            if (isAdmin) {
                this.find();
            }
            else {
                this.find({ department });
            }
            next();
        });
    });
};
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
    schema.pre("save", function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.responsable) {
                // Assuming you have a way to get the current user's id (replace with your logic)
                const user = contextService.get("request:user") || {};
                this.responsable = user.id;
            }
            next();
        });
    });
};
const capitalizeFields = (fields) => {
    return function (next) {
        fields.forEach((field) => {
            if (!this[field])
                return;
            this[field] = capitalizeFirstLetter(this[field]);
        });
        next();
    };
};
export { addCenterFilter, addResponsable, capitalizeFields, addDepartmentScope, };
