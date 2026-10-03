const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    const artists = db.collection("artists");
    const artworks = db.collection("artworks");

    // Clear existing data
    await artists.deleteMany({});
    await artworks.deleteMany({});

    // Insert artists
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
      {
        firstName: "Pablo",
        lastName: "Picasso",
        birthDate: new Date("1881-10-25"),
        country: "Spain",
        createdAt: new Date(),
      },
      {
        firstName: "Claude",
        lastName: "Monet",
        birthDate: new Date("1840-11-14"),
        country: "France",
        createdAt: new Date(),
      },
      {
        firstName: "Leonardo",
        lastName: "da Vinci",
        birthDate: new Date("1452-04-15"),
        country: "Italy",
        createdAt: new Date(),
      },
      {
        firstName: "Salvador",
        lastName: "Dali",
        birthDate: new Date("1904-05-11"),
        country: "Spain",
        createdAt: new Date(),
      },
      {
        firstName: "Rembrandt",
        lastName: "van Rijn",
        birthDate: new Date("1606-07-15"),
        country: "Netherlands",
        createdAt: new Date(),
      },
      {
        firstName: "Edvard",
        lastName: "Munch",
        birthDate: new Date("1863-12-12"),
        country: "Norway",
        createdAt: new Date(),
      },
      {
        firstName: "Johannes",
        lastName: "Vermeer",
        birthDate: new Date("1632-10-31"),
        country: "Netherlands",
        createdAt: new Date(),
      },
      {
        firstName: "Georgia",
        lastName: "OKeeffe",
        birthDate: new Date("1887-11-15"),
        country: "United States",
        createdAt: new Date(),
      },
      {
        firstName: "Andy",
        lastName: "Warhol",
        birthDate: new Date("1928-08-06"),
        country: "United States",
        createdAt: new Date(),
      },
      {
        firstName: "Henri",
        lastName: "Matisse",
        birthDate: new Date("1869-12-31"),
        country: "France",
        createdAt: new Date(),
      },
      {
        firstName: "Paul",
        lastName: "Cezanne",
        birthDate: new Date("1839-01-19"),
        country: "France",
        createdAt: new Date(),
      },
      {
        firstName: "Gustav",
        lastName: "Klimt",
        birthDate: new Date("1862-07-14"),
        country: "Austria",
        createdAt: new Date(),
      },
      {
        firstName: "Michelangelo",
        lastName: "Buonarroti",
        birthDate: new Date("1475-03-06"),
        country: "Italy",
        createdAt: new Date(),
      },
    ]);

    const ids = insertedArtists.insertedIds;

    // Insert artworks
    await artworks.insertMany([
      {
        title: "Starry Night",
        year: 1889,
        period: "Post-Impressionism",
        type: "Painting",
        file: "starry-night.jpg",
        artistId: ids[0],
        createdAt: new Date(),
      },
      {
        title: "The Two Fridas",
        year: 1939,
        period: "Surrealism",
        type: "Painting",
        file: "the-two-fridas.jpg",
        artistId: ids[1],
        createdAt: new Date(),
      },
      {
        title: "Guernica",
        year: 1937,
        period: "Cubism",
        type: "Painting",
        file: "guernica.jpg",
        artistId: ids[2],
        createdAt: new Date(),
      },
      {
        title: "Water Lilies",
        year: 1916,
        period: "Impressionism",
        type: "Painting",
        file: "water-lilies.jpg",
        artistId: ids[3],
        createdAt: new Date(),
      },
      {
        title: "Mona Lisa",
        year: 1503,
        period: "Renaissance",
        type: "Painting",
        file: "mona-lisa.jpg",
        artistId: ids[4],
        createdAt: new Date(),
      },
      {
        title: "The Persistence of Memory",
        year: 1931,
        period: "Surrealism",
        type: "Painting",
        file: "persistence-of-memory.jpg",
        artistId: ids[5],
        createdAt: new Date(),
      },
      {
        title: "The Night Watch",
        year: 1642,
        period: "Baroque",
        type: "Painting",
        file: "night-watch.jpg",
        artistId: ids[6],
        createdAt: new Date(),
      },
      {
        title: "The Scream",
        year: 1893,
        period: "Expressionism",
        type: "Painting",
        file: "the-scream.jpg",
        artistId: ids[7],
        createdAt: new Date(),
      },
      {
        title: "Girl with a Pearl Earring",
        year: 1665,
        period: "Dutch Golden Age",
        type: "Painting",
        file: "girl-with-pearl-earring.jpg",
        artistId: ids[8],
        createdAt: new Date(),
      },
      {
        title: "Red Canna",
        year: 1924,
        period: "Modernism",
        type: "Painting",
        file: "red-canna.jpg",
        artistId: ids[9],
        createdAt: new Date(),
      },
      {
        title: "Marilyn Diptych",
        year: 1962,
        period: "Pop Art",
        type: "Painting",
        file: "marilyn-diptych.jpg",
        artistId: ids[10],
        createdAt: new Date(),
      },
      {
        title: "The Dance",
        year: 1910,
        period: "Fauvism",
        type: "Painting",
        file: "the-dance.jpg",
        artistId: ids[11],
        createdAt: new Date(),
      },
      {
        title: "The Card Players",
        year: 1895,
        period: "Post-Impressionism",
        type: "Painting",
        file: "the-card-players.jpg",
        artistId: ids[12],
        createdAt: new Date(),
      },
      {
        title: "The Kiss",
        year: 1908,
        period: "Symbolism",
        type: "Painting",
        file: "the-kiss.jpg",
        artistId: ids[13],
        createdAt: new Date(),
      },
      {
        title: "David",
        year: 1504,
        period: "Renaissance",
        type: "Sculpture",
        file: "david.jpg",
        artistId: ids[14],
        createdAt: new Date(),
      },
    ]);

    console.log("✅ Database seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await client.close();
  }
}

run();
