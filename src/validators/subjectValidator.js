const validateCreateSubject = (body) => {
  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    return "Name is required";
  }

  return null;
};

const validateUpdateSubject = (body) => {
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return "Name must be a non-empty string";
    }
  }

  return null;
};

module.exports = { validateCreateSubject, validateUpdateSubject };
