const results = [];
let idCounter = 0;

const getNextResultId = () => ++idCounter;

module.exports = { results, getNextResultId };
