const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongo')(session)
const { isProduction } = require('./utils/helpers')

class Database {
  constructor () {
    this.secret = process.env.SECRET
    this.dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvga5.mongodb.net/inventari-insti?retryWrites=true&w=majority`
    this.store = new MongoDBStore({
      url: this.dbUrl,
      secret: this.secret,
      touchAfter: 24 * 60 * 60
    })
  }

  connect () {
    mongoose.connect(this.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  setupDatabase (connection = mongoose.connection) {
    connection.on('error', console.error.bind(console, 'connection error:'))
    connection.once('open', () => {
      console.log('Database connected')
    })

    this.store.on('error', function (e) {
      console.log('ERROR GUARDANT SESSIÓ', e)
    })

    return {
      store: this.store,
      name: 'session',
      secret: this.secret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: isProduction
      }
    }
  }
}

module.exports = new Database()
