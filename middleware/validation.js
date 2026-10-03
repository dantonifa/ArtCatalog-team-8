exports.validateArtist = (req, res, next) => {
  const { firstName, lastName, birthDate, country } = req.body;
  if (!firstName || !lastName || !birthDate || !country) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (isNaN(Date.parse(birthDate))) {
    return res.status(400).json({ error: "Invalid birthDate format" });
  }
  next();
};
exports.validateArtwork = (req, res, next) => {
  const { title, year, period, type, file, artistId } = req.body;
  if (!title || !year || !period || !type || !file || !artistId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (isNaN(year) || year > new Date().getFullYear()) {
    return res.status(400).json({ error: "Invalid year" });
  }
  next();
};
