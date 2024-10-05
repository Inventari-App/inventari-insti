import * as Joi from "joi";
import sanitizeHtml from "sanitize-html";

const extension = (joi: typeof Joi): Joi.Extension => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} no ha d'incloure HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value: string, helpers: Joi.CustomHelpers): string | Joi.ErrorReport {
        const clean = sanitizeHtml(value, {
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

export const articleSchema = BaseJoi.object({
  article,
});

export const articlesSchema = BaseJoi.object({
  articles: BaseJoi.array().items(article),
});

export const invoiceSchema = BaseJoi.object({
  invoiceItems: BaseJoi.array(),
  status: BaseJoi.string().valid("aprovada", "pendent", "rebuda", "rebutjada"),
  total: BaseJoi.number(),
  comment: BaseJoi.string().empty("").escapeHTML(),
});

export const itemSchema = BaseJoi.object({
  autoclose: BaseJoi.string(),
  nom: BaseJoi.string().required().escapeHTML(),
  tipus: BaseJoi.string().required().escapeHTML(),
  inventariable: BaseJoi.boolean().required(),
  descripcio: BaseJoi.string().empty("").escapeHTML(),
});

export const departmentSchema = BaseJoi.object({
  nom: BaseJoi.string().required().escapeHTML(),
  autoclose: BaseJoi.string(),
});

export const unitatSchema = BaseJoi.object({
  nom: BaseJoi.string().required().escapeHTML(),
  planta: BaseJoi.string().required().escapeHTML(),
  area: BaseJoi.string().required().escapeHTML(),
  zona: BaseJoi.string().required().escapeHTML(),
  autoclose: BaseJoi.string(),
});

export const zonaSchema = BaseJoi.object({
  nom: BaseJoi.string().required().escapeHTML(),
  autoclose: BaseJoi.string(),
});

export const plantaSchema = BaseJoi.object({
  nom: BaseJoi.string().required().escapeHTML(),
  autoclose: BaseJoi.string(),
});

export const areaSchema = BaseJoi.object({
  nom: BaseJoi.string().required().escapeHTML(),
  autoclose: BaseJoi.string(),
});

export const utilitatSchema = BaseJoi.object({
  utilitat: BaseJoi.object({
    autoclose: BaseJoi.string(),
  }).required(),
});

export const proveidorSchema = BaseJoi.object({
  nom: BaseJoi.string().required().escapeHTML(),
  cif: BaseJoi.string().allow("").optional(),
  adreca: BaseJoi.string().allow("").optional(),
  telefon: BaseJoi.number().allow("").optional(),
  email: BaseJoi.string().email().allow("").optional(),
  autoclose: BaseJoi.string().allow("").empty(""),
});

