const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

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

const inventari = Joi.object({
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

module.exports.inventariSchema = Joi.object({
  inventari,
});

module.exports.inventarisSchema = Joi.object({
  inventaris: Joi.array().items(inventari),
});

module.exports.invoiceSchema = Joi.object({
  invoiceItems: Joi.array(),
  status: Joi.string().valid("aprovada", "pendent", "rebuda", "rebutjada"),
  total: Joi.number(),
});

module.exports.itemSchema = Joi.object({
  autoclose: Joi.string(),
  nom: Joi.string().required().escapeHTML(),
  tipus: Joi.string().required().escapeHTML(),
  inventariable: Joi.boolean().required(),
  descripcio: Joi.string().empty("").escapeHTML(),
});

module.exports.departmentSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
});

module.exports.unitatSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  planta: Joi.string().required().escapeHTML(),
  area: Joi.string().required().escapeHTML(),
  zona: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

module.exports.zonaSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

module.exports.plantaSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

module.exports.areaSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  autoclose: Joi.string(),
});

module.exports.utilitatSchema = Joi.object({
  utilitat: Joi.object({
    autoclose: Joi.string(),
  }).required(),
});

module.exports.proveidorSchema = Joi.object({
  nom: Joi.string().required().escapeHTML(),
  cif: Joi.string().allow("").optional(),
  adreca: Joi.string().allow("").optional(),
  telefon: Joi.number().allow("").optional(),
  email: Joi.string().email().allow("").optional(),
  autoclose: Joi.string().allow("").empty(""),
});
