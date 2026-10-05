// controllers/auth.js

const getCurrentUser = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        authenticated: false,
        message: "Not authenticated"
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email || null,
        role: req.user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving user",
      error: error.message
    });
  }
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie("connect.sid");

    if (!req.session) {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return res.status(500).json({
          success: false,
          message: "Error destroying session"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    });
  });
};

module.exports = {
  getCurrentUser,
  logout
};