"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmploymentTypeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_employment_type_dto_1 = require("./create-employment-type.dto");
class UpdateEmploymentTypeDto extends (0, mapped_types_1.PartialType)(create_employment_type_dto_1.CreateEmploymentTypeDto) {
}
exports.UpdateEmploymentTypeDto = UpdateEmploymentTypeDto;
//# sourceMappingURL=update-employment-type.dto.js.map