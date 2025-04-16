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
exports.Media = exports.EntityType = exports.MediaType = void 0;
const typeorm_1 = require("typeorm");
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
    MediaType["PDF"] = "pdf";
})(MediaType || (exports.MediaType = MediaType = {}));
var EntityType;
(function (EntityType) {
    EntityType["PORTFOLIO"] = "portfolio";
    EntityType["USER"] = "user";
    EntityType["SUBSCRIPTION"] = "subscription";
    EntityType["CERTIFICATE"] = "certificate";
})(EntityType || (exports.EntityType = EntityType = {}));
let Media = class Media extends typeorm_1.BaseEntity {
};
exports.Media = Media;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Media.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MediaType,
    }),
    __metadata("design:type", String)
], Media.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Media.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Media.prototype, "entity_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EntityType,
    }),
    __metadata("design:type", String)
], Media.prototype, "entity_type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Media.prototype, "created_at", void 0);
exports.Media = Media = __decorate([
    (0, typeorm_1.Entity)()
], Media);
//# sourceMappingURL=media.entity.js.map