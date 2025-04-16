"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioModule = void 0;
const common_1 = require("@nestjs/common");
const portfolio_service_1 = require("./portfolio.service");
const portfolio_controller_1 = require("./portfolio.controller");
const typeorm_1 = require("@nestjs/typeorm");
const portfolio_entity_1 = require("./entities/portfolio.entity");
const shared_module_1 = require("../../shared/shared.module");
const profile_details_entity_1 = require("../profile-details/entities/profile-details.entity");
const media_module_1 = require("../media/media.module");
const media_entity_1 = require("../media/entities/media.entity");
let PortfolioModule = class PortfolioModule {
};
exports.PortfolioModule = PortfolioModule;
exports.PortfolioModule = PortfolioModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([portfolio_entity_1.Portfolio, profile_details_entity_1.ProfileDetails, media_entity_1.Media]),
            media_module_1.MediaModule,
            shared_module_1.SharedModule,
        ],
        controllers: [portfolio_controller_1.PortfolioController],
        providers: [portfolio_service_1.PortfolioService],
    })
], PortfolioModule);
//# sourceMappingURL=portfolio.module.js.map