// controllers/artists.js
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../data/database");

exports.getAll = async (req, res, next) => {
  try {
    const artists = await getDatabase().collection("artists").find().toArray();
    res.status(200).json(artists);
  } catch (err) {
    next(err); // Gracefully passes server errors to errorHandler.js
  }
};

exports.getOne = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID parameter format." });
    }
    const artist = await getDatabase()
      .collection("artists")
      .findOne({ _id: new ObjectId(req.params.id) });
      
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.status(200).json(artist);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    // Synchronized with your validation engine and swagger fields
    const newArtist = {
      name: req.body.name,
      bio: req.body.bio,
      birthYear: Number(req.body.birthYear),
      createdBy: req.user?._id || "system_admin",
      createdAt: new Date(),
    };
    
    const result = await getDatabase()
      .collection("artists")
      .insertOne(newArtist);
      
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID parameter format." });
    }

    // Swapped to replaceOne/set with matching swagger criteria
    const updatedArtist = {
      name: req.body.name,
      bio: req.body.bio,
      birthYear: Number(req.body.birthYear)
    };

    const result = await getDatabase()
      .collection("artists")
      .replaceOne({ _id: new ObjectId(req.params.id) }, updatedArtist);
      
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    
    res.status(204).send(); // 204 No Content is ideal for clean PUT operations
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID parameter format." });
    }
    
    const result = await getDatabase()
      .collection("artists")
      .deleteOne({ _id: new ObjectId(req.params.id) });
      
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }
    
    res.status(200).json({ message: "Artist deleted" });
  } catch (err) {
    next(err);
  }
};
