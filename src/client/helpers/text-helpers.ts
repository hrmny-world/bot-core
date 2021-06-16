// const filesize = require('filesize');
// const duration = require('humanize-duration');

/**
 * Capitalizes the first letter in a string.
 * @static
 * @returns {string} Capitalized string.
 * @example
 * Text.capitalize('*welcome back*'); // -> *Welcome back*
 */
export function capitalize(str: string): string {
  if (!str || !String(str).trim()) {
    return '';
  }
  const string = String(str).trim();
  return string.replace(/[a-zA-Z]/, letter => letter.toUpperCase());
}

/**
 * Capitalizes the first letter of every word in the string.
 * @returns {string} Capitalized string.
 * @example
 * Text.capitalizeAll('the sky is clear today'); // -> The Sky Is Clear Today
 */
export function capitalizeWords(str: string): string {
  if (!str || !String(str).trim()) {
    return '';
  }
  const string = String(str).trim();
  return string.replace(/^[a-z]|(?<=\s+|")[a-z]/gm, letter => letter.toUpperCase());
}

/**
 * Joins all arguments as strings with line breaks.
 * @static
 * @param {string[]} stringLines
 * @returns {string} lines joined with line breaks.
 * @example
 * // This call
 * lines('Hello', 'World');
 * // Will return "Hello\nWorld"
 */
export function lines(...stringLines: string[]) {
  if (!stringLines || !stringLines.length) {
    return '';
  }
  if (stringLines.length === 1) {
    return String(stringLines[0]).trim();
  }
  return stringLines.reduce((all, current) => `${all}\n${String(current).trim()}`, '').trim();
}

/**
 * Extracts numbers from a string.
 * @returns {number[]} Array of extracted numbers.
 */
export function numbers(str: string): number[] {
  if (!str || typeof str !== 'string') {
    return [];
  }

  const string = str
    // removes everything that isn't a number, a dot, a minus sign or a plus sign
    .replace(/[^0-9.\-+]/g, ' ')
    // multiple dots get replaced with space
    .replace(/[.][.]+/g, ' ')
    // collapses minus signs
    .replace(/[-][-]+/g, '-')
    // removes plus signs
    .replace(/(?<=\d)\+(?=\d)/g, ' ')
    .replace(/\+/g, '')
    // collapses all spaces
    .replace(/\s\s+/g, ' ')
    // splits at spaces
    .split(/ +/g);

  // converts everything to numbers and removes the NaN's
  return string.map(n => parseFloat(n)).filter(n => !Number.isNaN(n));
}
