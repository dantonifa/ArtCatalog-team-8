// middleware/auth.js

const isAuthenticated = (req, res, next) => {
  // Check if the user is logged in via Passport
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Authentication required",
  });
};

const isAdmin = (req, res, next) => {
  // 1. Verify if the user is authenticated first
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // 2. Safe to check role since req.user is guaranteed to exist now
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  // User is authenticated and is an admin, proceed to the route
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
