import helmet from "helmet";
import { isProduction } from "./utils/helpers";

function configHelmet(app) {
  if (isProduction) {
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
    app.use(
      helmet.contentSecurityPolicy({
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
      })
    );
  }
}

export default configHelmet;

