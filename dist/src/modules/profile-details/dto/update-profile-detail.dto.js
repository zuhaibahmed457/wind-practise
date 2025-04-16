"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDetailDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_profile_detail_dto_1 = require("./create-profile-detail.dto");
class UpdateProfileDetailDto extends (0, mapped_types_1.PartialType)(create_profile_detail_dto_1.CreateProfileDetailDto) {
}
exports.UpdateProfileDetailDto = UpdateProfileDetailDto;
//# sourceMappingURL=update-profile-detail.dto.js.map