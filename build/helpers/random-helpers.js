"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function num(min = 0, max = 10) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.num = num;
function nums(min = 0, max = 10, howMany = 1, allowRepeats = true) {
    const count = howMany < 1 ? 1 : howMany;
    if (allowRepeats) {
        return new Array(count).map(() => num(min, max));
    }
    const randomNums = new Set();
    while (randomNums.size < howMany) {
        randomNums.add(num(min, max));
    }
    return Array.from(randomNums);
}
exports.nums = nums;
function choice(arr = []) {
    return arr[Math.floor(Math.random() * arr.length)];
}
exports.choice = choice;
function choiceMany(arr = [], howMany = 1) {
    return new Array(howMany).map(() => choice(arr));
}
exports.choiceMany = choiceMany;
function float() {
    return Math.random();
}
exports.float = float;
function floats(howMany = 1) {
    const count = howMany < 1 ? 1 : howMany;
    return new Array(count).map(() => float());
}
exports.floats = floats;
function letter(includeCaps = false) {
    let letterPool = 'abcdefghijklmnopqrstuvwxyz';
    if (includeCaps)
        letterPool += letterPool.toUpperCase();
    return choice(letterPool);
}
exports.letter = letter;
function letters(howMany = 1, includeCaps = false) {
    const count = howMany < 1 ? 1 : Math.round(howMany);
    return new Array(count).map(() => letter(includeCaps));
}
exports.letters = letters;
