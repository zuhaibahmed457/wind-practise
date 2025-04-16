"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestTypeDecorator = void 0;
const common_1 = require("@nestjs/common");
const RequestTypeDecorator = (...requestTypes) => (0, common_1.SetMetadata)('requestType', requestTypes);
exports.RequestTypeDecorator = RequestTypeDecorator;
//# sourceMappingURL=request-type.decorator.js.map