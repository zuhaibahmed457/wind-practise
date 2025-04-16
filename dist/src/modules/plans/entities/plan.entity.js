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
exports.Plan = exports.PlanStatus = exports.PlanType = exports.PlanFor = void 0;
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
const typeorm_1 = require("typeorm");
var PlanFor;
(function (PlanFor) {
    PlanFor["ORGANIZATION"] = "organization";
    PlanFor["TECHNICIAN"] = "technician";
})(PlanFor || (exports.PlanFor = PlanFor = {}));
var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "free";
    PlanType["MONTHLY"] = "monthly";
    PlanType["YEARLY"] = "yearly";
})(PlanType || (exports.PlanType = PlanType = {}));
var PlanStatus;
(function (PlanStatus) {
    PlanStatus["ACTIVE"] = "active";
    PlanStatus["INACTIVE"] = "inactive";
})(PlanStatus || (exports.PlanStatus = PlanStatus = {}));
let Plan = class Plan extends typeorm_1.BaseEntity {
};
exports.Plan = Plan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Plan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Plan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PlanType }),
    __metadata("design:type", String)
], Plan.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PlanFor }),
    __metadata("design:type", String)
], Plan.prototype, "for", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "stripe_product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: null }),
    __metadata("design:type", Number)
], Plan.prototype, "number_of_employees_allowed", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: false }),
    __metadata("design:type", Array)
], Plan.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "free_duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "stripe_price_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PlanStatus, default: PlanStatus.ACTIVE }),
    __metadata("design:type", String)
], Plan.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscription_entity_1.Subscription, (subscription) => subscription.plan),
    __metadata("design:type", Array)
], Plan.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Plan.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Plan.prototype, "updated_at", void 0);
exports.Plan = Plan = __decorate([
    (0, typeorm_1.Entity)('plan')
], Plan);
//# sourceMappingURL=plan.entity.js.map