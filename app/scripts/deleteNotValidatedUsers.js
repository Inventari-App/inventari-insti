require('dotenv').config({ path: __dirname + '/../.env' })

const mongoose = require('mongoose');
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvga5.mongodb.net/inventari-insti?retryWrites=true&w=majority`
const User = require('../models/user');

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    await User.deleteMany({ isVerified: false })
    console.log('Not validated user(s) deleted')
  } catch (error) {
    console.error('Error deleting users', error);
  }

  mongoose.connection.close();
  console.log('MongoDB connection closed.');
});

