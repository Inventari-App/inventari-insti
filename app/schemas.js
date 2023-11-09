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

//const Joi = require('joi');

module.exports.articleSchema = Joi.object({
  article: Joi.object({
    preu: Joi.number().required().min(0),
    article: Joi.string().required().escapeHTML(),
    iva: Joi.number().min(0),
    inventariable: Joi.boolean(),
    proveidor: Joi.string().escapeHTML(),
    tipus: Joi.string().escapeHTML(),
    unitat: Joi.string().required().escapeHTML(),
    imatge: Joi.string().allow('').escapeHTML(),
    descripcio: Joi.string().allow('').escapeHTML(),
    numSerie: Joi.string().allow('').escapeHTML(),
    responsable: Joi.object()
  }).required(),
});

module.exports.invoiceSchema = Joi.object({
  invoiceItems: Joi.array(),
  status: Joi.string().valid('aprovada', 'pendent', 'rebuda', 'rebutjada'),
  total: Joi.number(),
});

module.exports.itemSchema = Joi.object({
  item: Joi.object({
    nom: Joi.string().required().escapeHTML(),
    tipus: Joi.string().required().escapeHTML(),
    inventariable: Joi.boolean().required(),
    descripcio: Joi.string().empty('').escapeHTML(),
  }).required(),
});

module.exports.departmentSchema = Joi.object({
  department: Joi.object({
    name: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.unitatSchema = Joi.object({
  unitat: Joi.object({
    //preu: Joi.number().required().min(0),
    nom: Joi.string().required().escapeHTML(),

    //num_serie: Joi.string().required().escapeHTML(),
    //unitats_integrants: Joi.number().required().min(0),
    //estat: Joi.string().required().escapeHTML(),
    //data_incorporacio: Joi.string().required(),
    //data_canvi: Joi.string().required(),
    //num_doc_procedencia: Joi.string().required().escapeHTML(),
    //proveidor: Joi.string().required().escapeHTML(),
    //objectiu: Joi.string().required().escapeHTML(),
    //observacions: Joi.string().escapeHTML(),
    //username: Joi.string().required().escapeHTML(),
    //zona: Joi.string().required().escapeHTML(),
    planta: Joi.string().required().escapeHTML(),
    area: Joi.string().required().escapeHTML(),
    zona: Joi.string().required().escapeHTML(),
    //tipus: Joi.string().required().escapeHTML(),
    //proforma: Joi.number().required().min(1),
    //comanda: Joi.number().required().min(1),
    //albara: Joi.string().required(),
    //factura: Joi.string().required()
    //imatge: Joi.string().escapeHTML(),
    //descripcio: Joi.string().escapeHTML()
    autoclose: Joi.string(),
  }).required(),
});

module.exports.zonaSchema = Joi.object({
  zona: Joi.object({
    //preu: Joi.number().required().min(0),
    nom: Joi.string().required().escapeHTML(),
    autoclose: Joi.string(),
  }).required(),
});

module.exports.plantaSchema = Joi.object({
  planta: Joi.object({
    //preu: Joi.number().required().min(0),
    nom: Joi.string().required().escapeHTML(),
    autoclose: Joi.string(),

    //num_serie: Joi.string().required().escapeHTML(),
    //unitats_integrants: Joi.number().required().min(0),
    //estat: Joi.string().required().escapeHTML(),
    //data_incorporacio: Joi.string().required(),
    //data_canvi: Joi.string().required(),
    //num_doc_procedencia: Joi.string().required().escapeHTML(),
    //proveidor: Joi.string().required().escapeHTML(),
    //objectiu: Joi.string().required().escapeHTML(),
    //observacions: Joi.string().escapeHTML(),
    //username: Joi.string().required().escapeHTML(),
    //zona: Joi.string().required().escapeHTML(),
    //planta: Joi.string().required().escapeHTML(),
    //area: Joi.string().required().escapeHTML(),
    //tipus: Joi.string().required().escapeHTML(),
    //inventariable: Joi.string().required().escapeHTML(),
    //tipus: Joi.string().required().escapeHTML(),
    //proforma: Joi.number().required().min(1),
    //comanda: Joi.number().required().min(1),
    //albara: Joi.string().required(),
    //factura: Joi.string().required()
    //imatge: Joi.string().escapeHTML(),
    //descripcio: Joi.string().escapeHTML()
  }).required(),
});

module.exports.areaSchema = Joi.object({
  area: Joi.object({
    //preu: Joi.number().required().min(0),
    nom: Joi.string().required().escapeHTML(),
    autoclose: Joi.string(),

    //num_serie: Joi.string().required().escapeHTML(),
    //unitats_integrants: Joi.number().required().min(0),
    //estat: Joi.string().required().escapeHTML(),
    //data_incorporacio: Joi.string().required(),
    //data_canvi: Joi.string().required(),
    //num_doc_procedencia: Joi.string().required().escapeHTML(),
    //proveidor: Joi.string().required().escapeHTML(),
    //objectiu: Joi.string().required().escapeHTML(),
    //observacions: Joi.string().escapeHTML(),
    //username: Joi.string().required().escapeHTML(),
    //zona: Joi.string().required().escapeHTML(),
    //planta: Joi.string().required().escapeHTML(),
    //area: Joi.string().required().escapeHTML(),
    //tipus: Joi.string().required().escapeHTML(),
    //inventariable: Joi.string().required().escapeHTML(),
    //tipus: Joi.string().required().escapeHTML(),
    //proforma: Joi.number().required().min(1),
    //comanda: Joi.number().required().min(1),
    //albara: Joi.string().required(),
    //factura: Joi.string().required()
    //imatge: Joi.string().escapeHTML(),
    //descripcio: Joi.string().escapeHTML()
  }).required(),
});

module.exports.utilitatSchema = Joi.object({
  utilitat: Joi.object({
    autoclose: Joi.string(),
    //preu: Joi.number().required().min(0),
    //nom: Joi.string().required().escapeHTML(),
    //num_serie: Joi.string().required().escapeHTML(),
    //unitats_integrants: Joi.number().required().min(0),
    //estat: Joi.string().required().escapeHTML(),
    //data_incorporacio: Joi.string().required(),
    //data_canvi: Joi.string().required(),
    //num_doc_procedencia: Joi.string().required().escapeHTML(),
    //proveidor: Joi.string().required().escapeHTML(),
    //objectiu: Joi.string().required().escapeHTML(),
    //observacions: Joi.string().escapeHTML(),
    //username: Joi.string().required().escapeHTML(),
    //zona: Joi.string().required().escapeHTML(),
    //planta: Joi.string().required().escapeHTML(),
    //area: Joi.string().required().escapeHTML(),
    //tipus: Joi.string().required().escapeHTML(),
    //inventariable: Joi.string().required().escapeHTML(),
    //tipus: Joi.string().required().escapeHTML(),
    //proforma: Joi.number().required().min(1),
    //comanda: Joi.number().required().min(1),
    //albara: Joi.string().required(),
    //factura: Joi.string().required()
    //imatge: Joi.string().escapeHTML(),
    //descripcio: Joi.string().escapeHTML()
  }).required(),
});

module.exports.proveidorSchema = Joi.object({
  proveidor: Joi.object({
    nom: Joi.string().required().escapeHTML(),
    cif: Joi.string().allow('').optional(),
    adreca: Joi.string().allow('').optional(),
    telefon: Joi.number().allow('').optional(),
    email: Joi.string().email().allow('').optional(),
    autoclose: Joi.string().allow('').empty(''),
  }).required(),
});
