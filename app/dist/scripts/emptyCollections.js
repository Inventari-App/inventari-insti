"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvga5.mongodb.net/inventari-insti?retryWrites=true&w=majority`;
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Connected to MongoDB');
    try {
        // Get all collection names
        const collections = yield mongoose.connection.db.listCollections().toArray();
        // Loop through each collection and empty it
        for (const collection of collections) {
            const collectionName = collection.name;
            // Skip system collections (e.g., indexes, system.profile)
            if (collectionName.startsWith('system.')) {
                continue;
            }
            // Drop the collection to empty it
            yield mongoose.connection.db.dropCollection(collectionName);
            console.log(`Collection ${collectionName} emptied.`);
        }
        // Close the Mongoose connection after emptying all collections
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
    catch (error) {
        console.error('Error emptying collections:', error);
    }
}));
