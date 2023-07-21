const sessionConfig = require("./database")
const configureApp = require("./config")
const app = configureApp(sessionConfig)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});