const teachers = [];
let idCounter = 0;

const getNextTeacherId = () => ++idCounter;

module.exports = { teachers, getNextTeacherId };
