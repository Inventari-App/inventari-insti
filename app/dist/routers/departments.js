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
const departments = __importStar(require("../controllers/departments"));
const middleware_1 = require("../middleware");
const schemas_1 = require("../schemas");
const router = express_1.default.Router();
const validateDepartment = (0, middleware_1.validateSchema)(schemas_1.departmentSchema);
router.route('/')
    .get((0, catchAsync_1.default)(departments.index))
    .post(middleware_1.isLoggedIn, validateDepartment, (0, catchAsync_1.default)(departments.createDepartment));
router.route('/all')
    .get((0, catchAsync_1.default)(departments.getDepartments));
router.get('/new', middleware_1.isLoggedIn, departments.renderNewForm);
router.route('/:id')
    .get((0, catchAsync_1.default)(departments.showDepartment))
    .put(middleware_1.isLoggedIn, middleware_1.isAdmin, validateDepartment, (0, catchAsync_1.default)(departments.updateDepartment))
    .delete(middleware_1.isLoggedIn, middleware_1.isAdmin, (0, catchAsync_1.default)(departments.deleteDepartment));
router.get('/:id/edit', middleware_1.isLoggedIn, middleware_1.isAdmin, (0, catchAsync_1.default)(departments.renderEditForm));
exports.default = router;
//# sourceMappingURL=departments.js.map