"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function capitalize(str) {
    if (!str || !String(str).trim()) {
        return '';
    }
    const string = String(str).trim();
    return string.replace(/[a-zA-Z]/, letter => letter.toUpperCase());
}
exports.capitalize = capitalize;
function capitalizeWords(str) {
    if (!str || !String(str).trim()) {
        return '';
    }
    const string = String(str).trim();
    return string.replace(/^[a-z]|(?<=\s+|")[a-z]/gm, letter => letter.toUpperCase());
}
exports.capitalizeWords = capitalizeWords;
function lines(...stringLines) {
    if (!stringLines || !stringLines.length) {
        return '';
    }
    if (stringLines.length === 1) {
        return String(stringLines[0]).trim();
    }
    return stringLines.reduce((all, current) => `${all}\n${String(current).trim()}`, '').trim();
}
exports.lines = lines;
function numbers(str) {
    if (!str || typeof str !== 'string') {
        return [];
    }
    const string = str
        .replace(/[^0-9.\-+]/g, ' ')
        .replace(/[.][.]+/g, ' ')
        .replace(/[-][-]+/g, '-')
        .replace(/(?<=\d)\+(?=\d)/g, ' ')
        .replace(/\+/g, '')
        .replace(/\s\s+/g, ' ')
        .split(/ +/g);
    return string.map(n => parseFloat(n)).filter(n => !Number.isNaN(n));
}
exports.numbers = numbers;
