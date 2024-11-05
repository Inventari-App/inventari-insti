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
const express_1 = __importDefault(require("express"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const utilitats = __importStar(require("../controllers/utilitats"));
const middleware_1 = require("../middleware");
const schemas_1 = require("../schemas");
const utilitat_1 = __importDefault(require("../models/utilitat"));
const router = express_1.default.Router();
const validateUtilitat = (0, middleware_1.validateSchema)(schemas_1.unitatSchema);
router.route('/')
    .get((0, catchAsync_1.default)(utilitats.index))
    .post(middleware_1.isLoggedIn, validateUtilitat, (0, catchAsync_1.default)(utilitats.createUtilitat));
router.get('/new', middleware_1.isLoggedIn, utilitats.renderNewForm);
router.route('/:id')
    .get((0, catchAsync_1.default)(utilitats.showUtilitat))
    .put(middleware_1.isLoggedIn, (0, middleware_1.isResponsable)(utilitat_1.default), validateUtilitat, (0, catchAsync_1.default)(utilitats.updateUtilitat))
    .delete(middleware_1.isLoggedIn, (0, middleware_1.isResponsable)(utilitat_1.default), (0, catchAsync_1.default)(utilitats.deleteUtilitat));
router.get('/:id/edit', middleware_1.isLoggedIn, (0, middleware_1.isResponsable)(utilitat_1.default), (0, catchAsync_1.default)(utilitats.renderEditForm));
exports.default = router;
//# sourceMappingURL=utilitats.js.map