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
const proveidors = __importStar(require("../controllers/proveidors"));
const middleware_1 = require("../middleware");
const schemas_1 = require("../schemas");
const proveidor_1 = __importDefault(require("../models/proveidor"));
const router = express_1.default.Router();
const validateProveidor = (0, middleware_1.validateSchema)(schemas_1.proveidorSchema);
router.route('/')
    .get((0, catchAsync_1.default)(proveidors.index))
    .post(middleware_1.isLoggedIn, validateProveidor, (0, catchAsync_1.default)(proveidors.createProveidor));
router.route('/all')
    .get((0, catchAsync_1.default)(proveidors.getProveidors));
router.get('/new', middleware_1.isLoggedIn, proveidors.renderNewForm);
router.route('/:id')
    .get((0, catchAsync_1.default)(proveidors.showProveidor))
    .put(middleware_1.isLoggedIn, (0, middleware_1.isResponsableOrAdmin)(proveidor_1.default), validateProveidor, (0, catchAsync_1.default)(proveidors.updateProveidor))
    .delete(middleware_1.isLoggedIn, (0, middleware_1.isResponsableOrAdmin)(proveidor_1.default), (0, catchAsync_1.default)(proveidors.deleteProveidor));
router.get('/:id/edit', middleware_1.isLoggedIn, (0, middleware_1.isResponsableOrAdmin)(proveidor_1.default), (0, catchAsync_1.default)(proveidors.renderEditForm));
exports.default = router;
//# sourceMappingURL=proveidors.js.map