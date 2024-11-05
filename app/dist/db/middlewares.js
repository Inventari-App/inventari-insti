"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDepartmentScope = exports.capitalizeFields = exports.addResponsable = exports.addCenterFilter = void 0;
const request_context_1 = __importDefault(require("request-context"));
const helpers_1 = require("../utils/helpers");
const addDepartmentScope = (schema) => {
    schema.pre(/^find/, function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isAdmin } = request_context_1.default.get("request:user") || {};
            const department = request_context_1.default.get("request:department") || {};
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
exports.addDepartmentScope = addDepartmentScope;
const addCenterFilter = (schema) => {
    schema.pre(/^find/, function (next) {
        const { center } = request_context_1.default.get("request:user") || {};
        if (!center) {
            return next();
        }
        this.find({ center });
        next();
    });
};
exports.addCenterFilter = addCenterFilter;
const addResponsable = (schema) => {
    schema.pre("save", function (next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.responsable) {
                // Assuming you have a way to get the current user's id (replace with your logic)
                const user = request_context_1.default.get("request:user") || {};
                this.responsable = user.id;
            }
            next();
        });
    });
};
exports.addResponsable = addResponsable;
const capitalizeFields = (fields) => {
    return function (next) {
        fields.forEach((field) => {
            if (!this[field])
                return;
            this[field] = (0, helpers_1.capitalizeFirstLetter)(this[field]);
        });
        next();
    };
};
exports.capitalizeFields = capitalizeFields;
//# sourceMappingURL=middlewares.js.map