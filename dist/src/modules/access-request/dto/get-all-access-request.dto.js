"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllAccessRequestDto = void 0;
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const access_request_entity_1 = require("../entities/access-request.entity");
const class_validator_1 = require("class-validator");
class GetAllAccessRequestDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllAccessRequestDto = GetAllAccessRequestDto;
__decorate([
    (0, class_validator_1.IsEnum)(access_request_entity_1.RequestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllAccessRequestDto.prototype, "status", void 0);
//# sourceMappingURL=get-all-access-request.dto.js.map