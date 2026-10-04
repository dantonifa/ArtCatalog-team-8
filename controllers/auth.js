// controllers/auth.js

const getCurrentUser = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        authenticated: false,
        message: "Not authenticated",
      });
    }

    res.status(200).json({
      authenticated: true,
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email || null,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user",
      error: error.message,
    });
  }
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({
          message: "Error destroying session",
        });
      }

      // Clear the session cookie
      res.clearCookie("connect.sid");

      // Redirect the user's browser back to the homepage
      return res.redirect("/");
    });
  });
};

module.exports = {
  getCurrentUser,
  logout,
};
