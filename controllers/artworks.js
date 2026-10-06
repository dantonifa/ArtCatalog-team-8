//controller/artworks.js
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../data/database");

// Función helper para evitar repetir código de validación de IDs
const isValidMongoId = (id) => ObjectId.isValid(id);

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
    const { id } = req.params;
    if (!isValidMongoId(id)) {
      return res.status(400).json({ error: "Invalid artwork ID format" });
    }

    const artwork = await getDatabase()
      .collection("artworks")
      .findOne({ _id: new ObjectId(id) });

    if (!artwork) return res.status(404).json({ error: "Artwork not found" });
    
    res.json(artwork);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, year, period, type, file, artistId } = req.body;

    if (!isValidMongoId(artistId)) {
      return res.status(400).json({ error: "Invalid artist ID format" });
    }

    const newArtwork = {
      title,
      year: year ? parseInt(year, 10) : null, // Evita guardar NaN si no se envía
      period,
      type,
      file,
      artistId: new ObjectId(artistId),
      createdBy: req.user?._id ? new ObjectId(req.user._id) : null, // Asegura ObjectId si req.user existe
      createdAt: new Date(),
    };

    const result = await getDatabase()
      .collection("artworks")
      .insertOne(newArtwork);

    // Retorna el objeto creado adjuntando el ID generado por MongoDB
    res.status(201).json({ _id: result.insertedId, ...newArtwork });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, year, period, type, file, artistId } = req.body;

    if (!isValidMongoId(id) || !isValidMongoId(artistId)) {
      return res.status(400).json({ error: "Invalid ID format provided" });
    }

    const result = await getDatabase()
      .collection("artworks")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title,
            year: year ? parseInt(year, 10) : null,
            period,
            type,
            file,
            artistId: new ObjectId(artistId),
          },
        }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    res.json({ message: "Artwork updated" });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidMongoId(id)) {
      return res.status(400).json({ error: "Invalid artwork ID format" });
    }

    const result = await getDatabase()
      .collection("artworks")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return res.status(404).json({ error: "Artwork not found" });
    
    res.json({ message: "Artwork deleted" });
  } catch (err) {
    next(err);
  }
};
