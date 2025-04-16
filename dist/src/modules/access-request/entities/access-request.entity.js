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
exports.AccessRequest = exports.RequestPurpose = exports.RequestType = exports.RequestStatus = void 0;
const profile_details_entity_1 = require("../../profile-details/entities/profile-details.entity");
const typeorm_1 = require("typeorm");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["DENIED"] = "denied";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var RequestType;
(function (RequestType) {
    RequestType["PORTFOLIO"] = "portfolio";
    RequestType["CERTIFICATE"] = "certificate";
})(RequestType || (exports.RequestType = RequestType = {}));
var RequestPurpose;
(function (RequestPurpose) {
    RequestPurpose["AUTO_ACCESS"] = "Auto access granted";
    RequestPurpose["USER_REQUESTED"] = "User requested access";
})(RequestPurpose || (exports.RequestPurpose = RequestPurpose = {}));
let AccessRequest = class AccessRequest extends typeorm_1.BaseEntity {
};
exports.AccessRequest = AccessRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AccessRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AccessRequest.prototype, "requested_from", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestType,
        array: true,
        default: [RequestType.PORTFOLIO, RequestType.CERTIFICATE],
    }),
    __metadata("design:type", Array)
], AccessRequest.prototype, "request_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], AccessRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestPurpose,
        default: RequestPurpose.USER_REQUESTED,
    }),
    __metadata("design:type", String)
], AccessRequest.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccessRequest.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AccessRequest.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profile_details_entity_1.ProfileDetails, (profile) => profile.access_requests, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'requested_by_id' }),
    __metadata("design:type", profile_details_entity_1.ProfileDetails)
], AccessRequest.prototype, "requested_by", void 0);
exports.AccessRequest = AccessRequest = __decorate([
    (0, typeorm_1.Entity)()
], AccessRequest);
//# sourceMappingURL=access-request.entity.js.map