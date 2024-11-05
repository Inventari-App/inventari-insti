"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const url_1 = __importDefault(require("url"));
function enforceHttps(app) {
    if (helpers_1.isProduction) {
        // Force HTTPS
        app.use((req, res, next) => {
            if (req.headers['x-forwarded-proto'] !== 'https') {
                const secureUrl = url_1.default.format({
                    protocol: 'https',
                    hostname: req.hostname,
                    port: app.get('port'),
                    pathname: req.url
                });
                return res.redirect(secureUrl);
            }
            next();
        });
    }
}
exports.default = enforceHttps;
//# sourceMappingURL=enforceHttps.js.map