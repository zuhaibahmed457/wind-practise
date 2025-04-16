"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDegreeTypeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_degree_type_dto_1 = require("./create-degree-type.dto");
class UpdateDegreeTypeDto extends (0, mapped_types_1.PartialType)(create_degree_type_dto_1.CreateDegreeTypeDto) {
}
exports.UpdateDegreeTypeDto = UpdateDegreeTypeDto;
//# sourceMappingURL=update-degree-type.dto.js.map