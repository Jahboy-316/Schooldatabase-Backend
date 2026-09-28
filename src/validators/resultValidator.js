const validTerms = ["First Term", "Second Term", "Third Term"];
const sessionRegex = /^\d{4}\/\d{4}$/;

const validateCreateResult = (body) => {
  const { studentId, subjectId, score, term, session } = body;

  if (studentId === undefined || studentId === null) {
    return "Student ID is required";
  }
  if (typeof studentId !== "number" || !Number.isInteger(studentId)) {
    return "Student ID must be an integer";
  }

  if (subjectId === undefined || subjectId === null) {
    return "Subject ID is required";
  }
  if (typeof subjectId !== "number" || !Number.isInteger(subjectId)) {
    return "Subject ID must be an integer";
  }

  if (score === undefined || score === null) {
    return "Score is required";
  }
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return "Score must be a number";
  }
  if (score < 0 || score > 100) {
    return "Score must be between 0 and 100";
  }

  if (!term || typeof term !== "string") {
    return "Term is required";
  }
  if (!validTerms.includes(term)) {
    return "Term must be First Term, Second Term, or Third Term";
  }

  if (!session || typeof session !== "string") {
    return "Session is required";
  }
  if (!sessionRegex.test(session)) {
    return "Session must be in format YYYY/YYYY (e.g. 2025/2026)";
  }
  const years = session.split("/");
  if (Number(years[1]) !== Number(years[0]) + 1) {
    return "Session years must be consecutive (e.g. 2025/2026)";
  }

  return null;
};

const validateUpdateResult = (body) => {
  const { studentId, subjectId, score, term, session } = body;

  if (studentId !== undefined) {
    if (typeof studentId !== "number" || !Number.isInteger(studentId)) {
      return "Student ID must be an integer";
    }
  }
  if (subjectId !== undefined) {
    if (typeof subjectId !== "number" || !Number.isInteger(subjectId)) {
      return "Subject ID must be an integer";
    }
  }
  if (score !== undefined) {
    if (typeof score !== "number" || !Number.isFinite(score)) {
      return "Score must be a number";
    }
    if (score < 0 || score > 100) {
      return "Score must be between 0 and 100";
    }
  }
  if (term !== undefined) {
    if (typeof term !== "string") {
      return "Term must be a string";
    }
    if (!validTerms.includes(term)) {
      return "Term must be First Term, Second Term, or Third Term";
    }
  }
  if (session !== undefined) {
    if (typeof session !== "string") {
      return "Session must be a string";
    }
    if (!sessionRegex.test(session)) {
      return "Session must be in format YYYY/YYYY (e.g. 2025/2026)";
    }
    const years = session.split("/");
    if (Number(years[1]) !== Number(years[0]) + 1) {
      return "Session years must be consecutive (e.g. 2025/2026)";
    }
  }

  return null;
};

module.exports = { validateCreateResult, validateUpdateResult };
