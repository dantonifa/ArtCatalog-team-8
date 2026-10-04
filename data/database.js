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
    db = client.db("artcatalogteam8");
    console.log("Database Name:", db.databaseName);
    callback(null, db);
  } catch (err) {
    callback(err);
  }
};

const getDatabase = () => {
  if (!db) throw Error("Database not initialized");
  return db;
};

module.exports = { initDb, getDatabase };
