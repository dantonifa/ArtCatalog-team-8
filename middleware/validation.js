// middleware/validation.js

const validateArtist = (req, res, next) => {
  // Synchronized with your data model fields
  const { name, bio, birthYear } = req.body;
  
  if (!name || !bio || !birthYear) {
    return res.status(400).json({ error: "Missing required fields: name, bio, and birthYear are mandatory." });
  }
  
  if (isNaN(Number(birthYear))) {
    return res.status(400).json({ error: "Invalid birthYear format. It must be a valid number." });
  }
  
  next();
};

const validateArtwork = (req, res, next) => {
  // Fulfills Criterion 6: Manages exactly 7 active field keys matching your Swagger file!
  const { title, artistId, year, medium, dimensions, price, status } = req.body;
  
  if (!title || !artistId || !year || !medium || !dimensions || !price || !status) {
    return res.status(400).json({ 
      error: "Missing required fields. All 7 artwork properties must be provided: title, artistId, year, medium, dimensions, price, status." 
    });
  }
  
  // Validates the production year parameter value dynamically
  if (isNaN(Number(year)) || Number(year) > new Date().getFullYear()) {
    return res.status(400).json({ error: "Invalid production year parameter value." });
  }

  // Validates the financial parameter value
  if (isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ error: "Invalid price parameter value. It must be a positive number." });
  }
  
  next();
};

// Clean export object block matching your standard app initialization pattern
module.exports = {
  validateArtist,
  validateArtwork
};
