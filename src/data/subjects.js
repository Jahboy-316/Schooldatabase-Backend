const subjects = [];
let idCounter = 0;

const getNextSubjectId = () => ++idCounter;

module.exports = { subjects, getNextSubjectId };
