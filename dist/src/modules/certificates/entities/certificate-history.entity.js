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
exports.CertificateHistory = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
const certificate_entity_1 = require("./certificate.entity");
let CertificateHistory = class CertificateHistory extends typeorm_1.BaseEntity {
};
exports.CertificateHistory = CertificateHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CertificateHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CertificateHistory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CertificateHistory.prototype, "issuing_authority", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CertificateHistory.prototype, "issuing_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CertificateHistory.prototype, "expiration_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CertificateHistory.prototype, "notification_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CertificateHistory.prototype, "certificate_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CertificateHistory.prototype, "modified_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'modified_by_id' }),
    __metadata("design:type", user_entity_1.User)
], CertificateHistory.prototype, "modified_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => certificate_entity_1.Certificate, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'certificate_id' }),
    __metadata("design:type", certificate_entity_1.Certificate)
], CertificateHistory.prototype, "certificate", void 0);
exports.CertificateHistory = CertificateHistory = __decorate([
    (0, typeorm_1.Entity)('certificate_history')
], CertificateHistory);
//# sourceMappingURL=certificate-history.entity.js.map