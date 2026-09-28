const classes = [];
let idCounter = 0;

const getNextClassId = () => ++idCounter;

module.exports = { classes, getNextClassId };
