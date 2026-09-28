const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCreateTeacher = (body) => {
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
  const subjectVal = body.subject !== undefined ? body.subject : body.subjectId;
  if (subjectVal !== undefined && subjectVal !== null) {
    if (typeof subjectVal !== "number" || !Number.isInteger(subjectVal)) {
      return "Subject ID must be an integer";
    }
  }
  if (body.userId !== undefined && body.userId !== null) {
    if (typeof body.userId !== "number" || !Number.isInteger(body.userId)) {
      return "User ID must be an integer";
    }
  }

  return null;
};

const validateUpdateTeacher = (body) => {
  const { name, email, phone, subjectId } = body;

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
  const subjectVal = body.subject !== undefined ? body.subject : body.subjectId;
  if (subjectVal !== undefined && subjectVal !== null) {
    if (typeof subjectVal !== "number" || !Number.isInteger(subjectVal)) {
      return "Subject ID must be an integer";
    }
  }

  return null;
};

module.exports = { validateCreateTeacher, validateUpdateTeacher };
