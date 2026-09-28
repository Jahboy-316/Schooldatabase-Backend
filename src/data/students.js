const students = [];
let idCounter = 0;

const getNextStudentId = () => ++idCounter;

module.exports = { students, getNextStudentId };
