"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicProfileModule = void 0;
const common_1 = require("@nestjs/common");
const public_profile_service_1 = require("./public-profile.service");
const public_profile_controller_1 = require("./public-profile.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let PublicProfileModule = class PublicProfileModule {
};
exports.PublicProfileModule = PublicProfileModule;
exports.PublicProfileModule = PublicProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        controllers: [public_profile_controller_1.PublicProfileController],
        providers: [public_profile_service_1.PublicProfileService],
    })
], PublicProfileModule);
//# sourceMappingURL=public-profile.module.js.map