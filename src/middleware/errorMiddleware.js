const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON payload" });
  }

  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
};

module.exports = errorHandler;
