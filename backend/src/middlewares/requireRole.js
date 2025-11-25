module.exports = function requireRole(roles = []) {

  // Convert single string → array
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      // Must be authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      // Missing roles array or role not allowed
      if (!Array.isArray(roles) || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not have permission."
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
