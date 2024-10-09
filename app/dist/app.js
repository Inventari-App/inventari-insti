import { load } from 'ts-dotenv';
import { handleRouteError, handleError } from './middleware';
import sessionConfig from './database';
import configureApp from './config';
const env = load({
    PORT: Number,
});
const app = configureApp(sessionConfig);
const port = env.PORT || 3000;
app.use(handleRouteError);
app.use(handleError);
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
