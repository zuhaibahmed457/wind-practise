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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const employee_service_1 = require("./employee.service");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const update_employee_dto_1 = require("./dto/update-employee.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const nestjs_form_data_1 = require("nestjs-form-data");
const get_all_employee_dto_1 = require("./dto/get-all-employee.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const manage_employee_status_dto_1 = require("./dto/manage-employee-status.dto");
const text_capitalize_1 = require("../../utils/text-capitalize");
let EmployeeController = class EmployeeController {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    async create(createProfileDetailsDto, currentUser) {
        const profileDetails = await this.employeeService.create(createProfileDetailsDto, currentUser);
        return {
            message: 'Employee created successfully',
            details: profileDetails,
        };
    }
    async findAll(getAllEmployeeDto, currentUser) {
        const { items, meta } = await this.employeeService.findAll(getAllEmployeeDto, currentUser);
        return {
            message: 'Employee feteched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const employee = await this.employeeService.findOne(paramIdDto, currentUser);
        return {
            message: 'Employee feteched successfully',
            details: employee,
        };
    }
    async update(paramIdDto, updateEmployeeDto, currentUser) {
        const updatedEmployee = await this.employeeService.update(paramIdDto, updateEmployeeDto, currentUser);
        return {
            message: 'Employee updated successfully',
            details: updatedEmployee,
        };
    }
    async manage_status(paramDto, manageEmployeeStatusDto, user) {
        const updatedJobPost = await this.employeeService.manageStatus(paramDto, manageEmployeeStatusDto, user);
        return {
            message: `${(0, text_capitalize_1.textCapitalize)(manageEmployeeStatusDto.status)} successfully`,
            details: updatedJobPost,
        };
    }
    async delete(paramIdDto, currentUser) {
        await this.employeeService.delete(paramIdDto, currentUser);
        return {
            message: 'Employee Delete successfully',
        };
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_employee_dto_1.GetAllEmployeeDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_employee_dto_1.UpdateEmployeeDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('manage-status/:id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        manage_employee_status_dto_1.ManageEmployeeStatusDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "manage_status", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "delete", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)('employee'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map