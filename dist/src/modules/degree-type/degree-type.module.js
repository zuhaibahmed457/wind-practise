"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegreeTypeModule = void 0;
const common_1 = require("@nestjs/common");
const degree_type_service_1 = require("./degree-type.service");
const degree_type_controller_1 = require("./degree-type.controller");
const typeorm_1 = require("@nestjs/typeorm");
const degree_type_entity_1 = require("./entities/degree-type.entity");
const shared_module_1 = require("../../shared/shared.module");
let DegreeTypeModule = class DegreeTypeModule {
};
exports.DegreeTypeModule = DegreeTypeModule;
exports.DegreeTypeModule = DegreeTypeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([degree_type_entity_1.DegreeType]), shared_module_1.SharedModule],
        controllers: [degree_type_controller_1.DegreeTypeController],
        providers: [degree_type_service_1.DegreeTypeService],
    })
], DegreeTypeModule);
//# sourceMappingURL=degree-type.module.js.map