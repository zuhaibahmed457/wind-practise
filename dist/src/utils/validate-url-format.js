"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUrlOrEmpty = void 0;
const class_validator_1 = require("class-validator");
let IsUrlOrEmpty = class IsUrlOrEmpty {
    validate(value) {
        if (value === '' || value === null || value === undefined)
            return true;
        try {
            new URL(value);
            return true;
        }
        catch {
            return false;
        }
    }
    defaultMessage() {
        return 'Invalid URL. It should be a valid URL or an empty string.';
    }
};
exports.IsUrlOrEmpty = IsUrlOrEmpty;
exports.IsUrlOrEmpty = IsUrlOrEmpty = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isUrlOrEmpty', async: false })
], IsUrlOrEmpty);
//# sourceMappingURL=validate-url-format.js.map