"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveidorSchema = exports.utilitatSchema = exports.areaSchema = exports.plantaSchema = exports.zonaSchema = exports.unitatSchema = exports.departmentSchema = exports.itemSchema = exports.invoiceSchema = exports.articlesSchema = exports.articleSchema = void 0;
const Joi = __importStar(require("joi"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} no ha d'incloure HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = (0, sanitize_html_1.default)(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) {
                    return helpers.error("string.escapeHTML", { value });
                }
                return clean;
            },
        },
    },
});
const BaseJoi = Joi.extend(extension);
const article = BaseJoi.object({
    preu: BaseJoi.number().min(0),
    article: BaseJoi.string().required().escapeHTML(),
    iva: BaseJoi.number().min(0),
    inventariable: BaseJoi.string().allow("").escapeHTML(),
    proveidor: BaseJoi.string().allow("").escapeHTML(),
    tipus: BaseJoi.string().allow("").escapeHTML(),
    unitat: BaseJoi.string().required().escapeHTML(),
    descripcio: BaseJoi.string().allow("").escapeHTML(),
    numSerie: BaseJoi.string().allow("").escapeHTML(),
    department: BaseJoi.string().allow("").escapeHTML(),
});
exports.articleSchema = BaseJoi.object({
    article,
});
exports.articlesSchema = BaseJoi.object({
    articles: BaseJoi.array().items(article),
});
exports.invoiceSchema = BaseJoi.object({
    invoiceItems: BaseJoi.array(),
    status: BaseJoi.string().valid("aprovada", "pendent", "rebuda", "rebutjada"),
    total: BaseJoi.number(),
    comment: BaseJoi.string().empty("").escapeHTML(),
});
exports.itemSchema = BaseJoi.object({
    autoclose: BaseJoi.string(),
    nom: BaseJoi.string().required().escapeHTML(),
    tipus: BaseJoi.string().required().escapeHTML(),
    inventariable: BaseJoi.boolean().required(),
    descripcio: BaseJoi.string().empty("").escapeHTML(),
});
exports.departmentSchema = BaseJoi.object({
    nom: BaseJoi.string().required().escapeHTML(),
    autoclose: BaseJoi.string(),
});
exports.unitatSchema = BaseJoi.object({
    nom: BaseJoi.string().required().escapeHTML(),
    planta: BaseJoi.string().required().escapeHTML(),
    area: BaseJoi.string().required().escapeHTML(),
    zona: BaseJoi.string().required().escapeHTML(),
    autoclose: BaseJoi.string(),
});
exports.zonaSchema = BaseJoi.object({
    nom: BaseJoi.string().required().escapeHTML(),
    autoclose: BaseJoi.string(),
});
exports.plantaSchema = BaseJoi.object({
    nom: BaseJoi.string().required().escapeHTML(),
    autoclose: BaseJoi.string(),
});
exports.areaSchema = BaseJoi.object({
    nom: BaseJoi.string().required().escapeHTML(),
    autoclose: BaseJoi.string(),
});
exports.utilitatSchema = BaseJoi.object({
    utilitat: BaseJoi.object({
        autoclose: BaseJoi.string(),
    }).required(),
});
exports.proveidorSchema = BaseJoi.object({
    nom: BaseJoi.string().required().escapeHTML(),
    cif: BaseJoi.string().allow("").optional(),
    adreca: BaseJoi.string().allow("").optional(),
    telefon: BaseJoi.number().allow("").optional(),
    email: BaseJoi.string().email().allow("").optional(),
    autoclose: BaseJoi.string().allow("").empty(""),
});
//# sourceMappingURL=schemas.js.map