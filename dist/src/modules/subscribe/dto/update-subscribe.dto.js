"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscribeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_subscribe_dto_1 = require("./create-subscribe.dto");
class UpdateSubscribeDto extends (0, mapped_types_1.PartialType)(create_subscribe_dto_1.CreateSubscribeDto) {
}
exports.UpdateSubscribeDto = UpdateSubscribeDto;
//# sourceMappingURL=update-subscribe.dto.js.map