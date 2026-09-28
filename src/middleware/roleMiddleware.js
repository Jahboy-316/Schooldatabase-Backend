const { teachers } = require("../data/teachers");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (req.user.role === "teacher") {
      const isVerified = teachers.some(
        (t) => (t.userId && t.userId === req.user.id) || (t.email && t.email.toLowerCase() === req.user.email.toLowerCase())
      );
      if (!isVerified) {
        return res.status(403).json({
          success: false,
          message: "Teacher profile not found. An admin must create your teacher record first."
        });
      }
    }

    next();
  };
};

module.exports = authorize;
