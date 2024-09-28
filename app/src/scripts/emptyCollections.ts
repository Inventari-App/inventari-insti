require('dotenv').config({ path: __dirname + '/../.env' })

const mongoose = require('mongoose');
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvga5.mongodb.net/inventari-insti?retryWrites=true&w=majority`

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();

    // Loop through each collection and empty it
    for (const collection of collections) {
      const collectionName = collection.name;

      // Skip system collections (e.g., indexes, system.profile)
      if (collectionName.startsWith('system.')) {
        continue;
      }

      // Drop the collection to empty it
      await mongoose.connection.db.dropCollection(collectionName);
      console.log(`Collection ${collectionName} emptied.`);
    }

    // Close the Mongoose connection after emptying all collections
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Error emptying collections:', error);
  }
});
