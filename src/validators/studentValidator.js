const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCreateStudent = (body) => {
  const { name, email, phone } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return "Name is required";
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return "Email is required";
  }
  if (!emailRegex.test(email.trim())) {
    return "Invalid email format";
  }
  if (!phone || typeof phone !== "string" || !phone.trim()) {
    return "Phone is required";
  }
  const classVal = body.class !== undefined ? body.class : body.classId;
  if (classVal !== undefined && classVal !== null) {
    if (typeof classVal !== "number" || !Number.isInteger(classVal)) {
      return "Class ID must be an integer";
    }
  }
  if (body.userId !== undefined && body.userId !== null) {
    if (typeof body.userId !== "number" || !Number.isInteger(body.userId)) {
      return "User ID must be an integer";
    }
  }

  return null;
};

const validateUpdateStudent = (body) => {
  const { name, email, phone, classId } = body;

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return "Name must be a non-empty string";
    }
  }
  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      return "Email must be a non-empty string";
    }
    if (!emailRegex.test(email.trim())) {
      return "Invalid email format";
    }
  }
  if (phone !== undefined) {
    if (typeof phone !== "string" || !phone.trim()) {
      return "Phone must be a non-empty string";
    }
  }
  const classVal = body.class !== undefined ? body.class : body.classId;
  if (classVal !== undefined && classVal !== null) {
    if (typeof classVal !== "number" || !Number.isInteger(classVal)) {
      return "Class ID must be an integer";
    }
  }

  return null;
};

module.exports = { validateCreateStudent, validateUpdateStudent };
