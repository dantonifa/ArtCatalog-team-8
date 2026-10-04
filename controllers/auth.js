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

// controllers/auth.js

const logout = (req, res, next) => {
  // 1. Log out from Passport first
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    // 2. Clear the browser cookie immediately
    res.clearCookie("connect.sid");

    // 3. Destroy the session store
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({
          message: "Error destroying session",
        });
      }

      // 4. Force the user's browser back to your home landing page
      return res.redirect("/");
    });
  });
};

module.exports = {
  getCurrentUser,
  logout,
};

