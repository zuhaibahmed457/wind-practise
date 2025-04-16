"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateS3Dto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_s3_dto_1 = require("./create-s3.dto");
class UpdateS3Dto extends (0, mapped_types_1.PartialType)(create_s3_dto_1.CreateS3Dto) {
}
exports.UpdateS3Dto = UpdateS3Dto;
//# sourceMappingURL=update-s3.dto.js.map