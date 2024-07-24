require('dotenv').config()
const { handleRouteError, handleError } = require('./middleware')

const db = require('./database')
db.connect()
const sessionConfig = db.setupDatabase()

const configureApp = require('./config')
const app = configureApp(sessionConfig)
const port = process.env.PORT || 3000

app.use(handleRouteError)
app.use(handleError)

app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})
