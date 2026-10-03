const { ObjectId } = require("mongodb");
const { getDatabase } = require("../data/database");

exports.getAll = async (req, res, next) => {
  try {
    const artworks = await getDatabase()
      .collection("artworks")
      .find()
      .toArray();
    res.json(artworks);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const artwork = await getDatabase()
      .collection("artworks")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!artwork) return res.status(404).json({ error: "Artwork not found" });
    res.json(artwork);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const newArtwork = {
      title: req.body.title,
      year: parseInt(req.body.year),
      period: req.body.period,
      type: req.body.type,
      file: req.body.file,
      artistId: new ObjectId(req.body.artistId),
      createdBy: req.user?._id,
      createdAt: new Date(),
    };
    const result = await getDatabase()
      .collection("artworks")
      .insertOne(newArtwork);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const result = await getDatabase()
      .collection("artworks")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Artwork not found" });
    res.json({ message: "Artwork updated" });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await getDatabase()
      .collection("artworks")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Artwork not found" });
    res.json({ message: "Artwork deleted" });
  } catch (err) {
    next(err);
  }
};
