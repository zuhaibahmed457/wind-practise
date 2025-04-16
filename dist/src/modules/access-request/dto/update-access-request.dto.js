"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAccessRequestDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_access_request_dto_1 = require("./create-access-request.dto");
class UpdateAccessRequestDto extends (0, mapped_types_1.PartialType)(create_access_request_dto_1.CreateAccessRequestDto) {
}
exports.UpdateAccessRequestDto = UpdateAccessRequestDto;
//# sourceMappingURL=update-access-request.dto.js.map