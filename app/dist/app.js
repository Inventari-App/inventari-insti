"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dotenv_1 = require("ts-dotenv");
const index_ts_1 = require("./middleware/index.ts");
const database_ts_1 = __importDefault(require("./database.ts"));
const config_ts_1 = __importDefault(require("./config.ts"));
const env = (0, ts_dotenv_1.load)({
    PORT: Number,
});
const app = (0, config_ts_1.default)(database_ts_1.default);
const port = env.PORT || 3000;
app.use(index_ts_1.handleRouteError);
app.use(index_ts_1.handleError);
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
//# sourceMappingURL=app.js.map