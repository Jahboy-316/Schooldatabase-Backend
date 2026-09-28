const validateCreateClass = (body) => {
  const { name } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return "Name is required";
  }
  if (body.teacherId !== undefined && body.teacherId !== null) {
    if (typeof body.teacherId !== "number" || !Number.isInteger(body.teacherId)) {
      return "Teacher ID must be an integer";
    }
  }

  return null;
};

const validateUpdateClass = (body) => {
  const { name, teacherId } = body;

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return "Name must be a non-empty string";
    }
  }
  if (teacherId !== undefined && teacherId !== null) {
    if (typeof teacherId !== "number" || !Number.isInteger(teacherId)) {
      return "Teacher ID must be an integer";
    }
  }

  return null;
};

module.exports = { validateCreateClass, validateUpdateClass };
