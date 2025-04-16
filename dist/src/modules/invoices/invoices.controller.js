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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const invoices_service_1 = require("./invoices.service");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const get_all_invoices_schema_dto_1 = require("./dto/get-all-invoices-schema.dto");
const user_entity_1 = require("../users/entities/user.entity");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const roles_guard_1 = require("../../shared/guards/roles.guard");
let InvoicesController = class InvoicesController {
    constructor(invoicesService) {
        this.invoicesService = invoicesService;
    }
    async findAll(currentUser, getAllInvoicesDto) {
        const invoices = await this.invoicesService.findAll(currentUser, getAllInvoicesDto);
        return {
            message: 'Invoices fetched successfully',
            details: invoices.items,
            extra: invoices.meta,
        };
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_all_invoices_schema_dto_1.GetAllInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "findAll", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map