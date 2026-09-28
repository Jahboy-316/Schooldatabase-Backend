const users = [];
let idCounter = 0;

const getNextUserId = () => ++idCounter;

module.exports = { users, getNextUserId };
