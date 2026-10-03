require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    // Collections
    const artists = db.collection("artists");
    const artworks = db.collection("artworks");

    // Clear old data
    await artists.deleteMany({});
    await artworks.deleteMany({});

    // Insert sample artists
    const insertedArtists = await artists.insertMany([
      {
        firstName: "Vincent",
        lastName: "van Gogh",
        birthDate: new Date("1853-03-30"),
        country: "Netherlands",
        createdAt: new Date(),
      },
      {
        firstName: "Frida",
        lastName: "Kahlo",
        birthDate: new Date("1907-07-06"),
        country: "Mexico",
        createdAt: new Date(),
      },
    ]);

    // Insert sample artworks linked to artists
    await artworks.insertMany([
      {
        title: "Starry Night",
        year: 1889,
        period: "Post-Impressionism",
        type: "Painting",
        file: "starry-night.jpg",
        artistId: insertedArtists.insertedIds[0],
        createdAt: new Date(),
      },
      {
        title: "The Two Fridas",
        year: 1939,
        period: "Surrealism",
        type: "Painting",
        file: "two-fridas.jpg",
        artistId: insertedArtists.insertedIds[1],
        createdAt: new Date(),
      },
    ]);

    console.log("✅ Database seeded with sample artists and artworks");
  } finally {
    await client.close();
  }
}

run().catch(console.error);
