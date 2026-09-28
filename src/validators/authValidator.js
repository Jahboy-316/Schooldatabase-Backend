const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validRoles = ["admin", "teacher", "student"];

const validateRegistration = (body) => {
  const { firstName, surname, email, password, role } = body;

  if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
    return "First name is required";
  }
  if (!surname || typeof surname !== "string" || !surname.trim()) {
    return "Surname is required";
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return "Email is required";
  }
  if (!emailRegex.test(email.trim())) {
    return "Invalid email format";
  }
  if (!password || typeof password !== "string") {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (!role || typeof role !== "string" || !role.trim()) {
    return "Role is required";
  }
  if (!validRoles.includes(role.toLowerCase().trim())) {
    return "Role must be admin, teacher, or student";
  }

  return null;
};

const validateLogin = (body) => {
  const { email, password } = body;

  if (!email || typeof email !== "string" || !email.trim()) {
    return "Email is required";
  }
  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  return null;
};

module.exports = { validateRegistration, validateLogin };
