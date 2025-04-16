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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRequestGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const access_request_entity_1 = require("../../modules/access-request/entities/access-request.entity");
const certificate_entity_1 = require("../../modules/certificates/entities/certificate.entity");
const portfolio_entity_1 = require("../../modules/portfolio/entities/portfolio.entity");
const class_validator_1 = require("class-validator");
let AccessRequestGuard = class AccessRequestGuard {
    constructor(accessRequestRepo, portfolioRepo, certificateRepo) {
        this.accessRequestRepo = accessRequestRepo;
        this.portfolioRepo = portfolioRepo;
        this.certificateRepo = certificateRepo;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const currentUser = request?.user || null;
        let profileDetailsId = request.query.profile_details_id || null;
        const email = request.query.email || null;
        const requestType = [access_request_entity_1.RequestType.PORTFOLIO, access_request_entity_1.RequestType.CERTIFICATE];
        if (requestType.includes(access_request_entity_1.RequestType.PORTFOLIO)) {
            let searchCondition;
            if ((0, class_validator_1.isUUID)(request?.params?.id)) {
                searchCondition = { id: request.params.id };
            }
            else if (profileDetailsId) {
                searchCondition = { profile_details: { id: profileDetailsId } };
            }
            else {
                searchCondition = {
                    profile_details: { user: { id: currentUser?.id } },
                };
            }
            const portfolio = await this.portfolioRepo.findOne({
                where: searchCondition,
                relations: { profile_details: true },
            });
            profileDetailsId = portfolio?.profile_details?.id;
            if (portfolio?.profile_details?.id === currentUser?.profile_detail?.id &&
                currentUser?.profile_detail?.id != undefined)
                return true;
        }
        if (requestType.includes(access_request_entity_1.RequestType.CERTIFICATE)) {
            let searchCondition;
            if ((0, class_validator_1.isUUID)(request?.params?.id)) {
                searchCondition = { id: request?.params?.id };
            }
            else if (profileDetailsId) {
                searchCondition = { profile_details: { id: profileDetailsId } };
            }
            else {
                searchCondition = { created_by: { id: currentUser?.id } };
            }
            const certificate = await this.certificateRepo.findOne({
                where: searchCondition,
                relations: { created_by: true, profile_details: true },
            });
            if (!certificate)
                return true;
            profileDetailsId = certificate?.profile_details?.id;
            if (certificate?.created_by?.id === currentUser?.id &&
                currentUser?.id != undefined)
                return true;
        }
        const accessRequest = await this.accessRequestRepo.findOne({
            where: {
                requested_from: email,
                requested_by: {
                    id: profileDetailsId,
                },
            },
            order: {
                created_at: 'DESC',
            },
            relations: {
                requested_by: true,
            },
        });
        if (!accessRequest ||
            accessRequest?.requested_by?.id !== profileDetailsId) {
            throw new common_1.ForbiddenException(`You don't have permission to access this ${requestType}`);
        }
        if (accessRequest.status !== access_request_entity_1.RequestStatus.APPROVED) {
            throw new common_1.ForbiddenException(accessRequest.status === access_request_entity_1.RequestStatus.DENIED
                ? 'Access request denied.'
                : 'Access request pending.');
        }
        return true;
    }
};
exports.AccessRequestGuard = AccessRequestGuard;
exports.AccessRequestGuard = AccessRequestGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(access_request_entity_1.AccessRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(2, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AccessRequestGuard);
//# sourceMappingURL=access-request.guard.js.map