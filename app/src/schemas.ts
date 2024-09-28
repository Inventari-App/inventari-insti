import BaseJoi from "joi";
import sanitizeHtml from "sanitize-html";

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} no ha d'incloure HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

const article = Joi.object({
  preu: Joi.number().min(0),
  article: Joi.string().required().escapeHTML(),
  iva: Joi.number().min(0),
  inventariable: Joi.string().allow("").escapeHTML(),
  proveidor: Joi.string().allow("").escapeHTML(),
  tipus: Joi.string().allow("").escapeHTML(),
  unitat: Joi.string().required().escapeHTML(),
  descripcio: Joi.string().allow("").escapeHTML(),
  numSerie: Joi.string().allow("").escapeHTML(),
  department: Joi.string().allow("").escapeHTML(),
});

export const articleSchema = Joi.object({
  article,
});

export const articlesSchema = Joi.object({
  articles: Joi.array().items(article),
});

export const invoiceSchema = Joi.object({
  invoiceItems: Joi.array(),
  status: Joi.string().valid("aprovada", "pendent", "rebuda", "rebutjada"),
  total: Joi.number(),
  comment: Joi.string().empty("").escapeHTML(),
});

export const itemSchema = Joi.object({
  autoclose: Joi.string(),
  nom: Joi.string().required().escapeHTML(),
  tipus: Joi.string().required().escapeHTML(),
  inventariable: Joi.boolean().required(),
  descripcio: Joi.string().empty("").escapeHTML(),
});

export const departmentSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

export const unitatSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  planta: Joi.string().required().escapeHTML(),
  area: Joi.string().required().escapeHTML(),
  zona: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

export const zonaSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

export const plantaSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

export const areaSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

export const utilitatSchema = Joi.object({
  utilitat: Joi.object({
    autoclose: Joi.string(),
  }).required(),
});

export const proveidorSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  cif: Joi.string().allow("").optional(),
  adreca: Joi.string().allow("").optional(),
  telefon: Joi.number().allow("").optional(),
  email: Joi.string().email().allow("").optional(),
  autoclose: Joi.string().allow("").empty(""),
});

