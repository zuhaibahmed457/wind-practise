"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = void 0;
const capitalize = ({ value }) => value
    ?.split(' ')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')
    .trim();
exports.capitalize = capitalize;
//# sourceMappingURL=capatilize-each-word.js.map