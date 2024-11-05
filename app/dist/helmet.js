"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const helpers_1 = require("./utils/helpers");
function configHelmet(app) {
    if (helpers_1.isProduction) {
        const scriptSrcUrls = [
            "https://stackpath.bootstrapcdn.com/",
            "https://kit.fontawesome.com/",
            "https://cdnjs.cloudflare.com/",
            "https://cdn.jsdelivr.net",
        ];
        const styleSrcUrls = [
            "https://stackpath.bootstrapcdn.com/",
            "https://kit-free.fontawesome.com/",
            "https://fonts.googleapis.com/",
            "https://use.fontawesome.com/",
            "https://cdn.jsdelivr.net",
        ];
        const connectSrcUrls = [
            "https://api.mapbox.com/",
            "https://a.tiles.mapbox.com/",
            "https://b.tiles.mapbox.com/",
            "https://events.mapbox.com/",
        ];
        const fontSrcUrls = [
            "https://cdn.jsdelivr.net"
        ];
        app.use(helmet_1.default.contentSecurityPolicy({
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/YOURACCOUNT/", // SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                    "https://images.unsplash.com/",
                    "https://unsplash.com/es/s/fotos/",
                    "fakeimg.pl"
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
            },
        }));
    }
}
exports.default = configHelmet;
//# sourceMappingURL=helmet.js.map