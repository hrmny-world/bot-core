"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatString(...args) {
    let mainString = args[0];
    const replacers = args.slice(1);
    for (const index in replacers) {
        if (mainString.includes(index)) {
            const exp = new RegExp(`\\{${index}\\}`, 'g');
            mainString = mainString.replace(exp, replacers[index]);
        }
    }
    return mainString;
}
exports.default = formatString;
