"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const login_attempt_entity_1 = require("../auth/entities/login-attempt.entity");
const profile_details_entity_1 = require("../profile-details/entities/profile-details.entity");
const media_entity_1 = require("../media/entities/media.entity");
const media_module_1 = require("../media/media.module");
const notifications_module_1 = require("../notifications/notifications.module");
const user_notification_setting_entity_1 = require("../notifications/entities/user-notification-setting.entity");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                login_attempt_entity_1.LoginAttempt,
                profile_details_entity_1.ProfileDetails,
                media_entity_1.Media,
                user_notification_setting_entity_1.UserNotificationSetting,
            ]),
            media_module_1.MediaModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map