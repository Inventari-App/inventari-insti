import { isProduction } from "./helpers";
import url from "url";
function enforceHttps(app) {
    if (isProduction) {
        // Force HTTPS
        app.use((req, res, next) => {
            if (req.headers['x-forwarded-proto'] !== 'https') {
                const secureUrl = url.format({
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
export default enforceHttps;
