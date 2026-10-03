const { ObjectId } = require("mongodb");
const { getDatabase } = require("../data/database");

exports.getAll = async (req, res, next) => {
  try {
    const artists = await getDatabase().collection("artists").find().toArray();
    res.json(artists);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const artist = await getDatabase()
      .collection("artists")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json(artist);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const newArtist = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDate: new Date(req.body.birthDate),
      country: req.body.country,
      createdBy: req.user?._id,
      createdAt: new Date(),
    };
    const result = await getDatabase()
      .collection("artists")
      .insertOne(newArtist);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await getDatabase()
      .collection("artists")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Artist not found" });
    res.json({ message: "Artist updated" });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await getDatabase()
      .collection("artists")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Artist not found" });
    res.json({ message: "Artist deleted" });
  } catch (err) {
    next(err);
  }
};
