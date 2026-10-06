// data/database.js
const { MongoClient } = require("mongodb");

let db;

const initDb = async (callback) => {
  if (db) {
    console.log("Database already initialized");
    return callback(null, db);
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    // Explicitly target your deployment cluster database space
    db = client.db("artcatalogteam8");
    
    console.log("🚀 MongoDB Connected! Active Database Workspace:", db.databaseName);
    callback(null, db);
  } catch (err) {
    callback(err);
  }
};

const getDatabase = () => {
  if (!db) throw Error("Database connection has not been initialized yet.");
  return db;
};

module.exports = { initDb, getDatabase };
