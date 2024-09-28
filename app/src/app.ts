import dotenv from 'dotenv';
import { handleRouteError, handleError } from './middleware';
import sessionConfig from './database';
import configureApp from './config';

dotenv.config();

const app = configureApp(sessionConfig);
const port = process.env.PORT || 3000;

app.use(handleRouteError);
app.use(handleError);

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

