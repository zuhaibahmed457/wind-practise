"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuperAdmin = void 0;
const user_notification_setting_entity_1 = require("../src/modules/notifications/entities/user-notification-setting.entity");
const user_entity_1 = require("../src/modules/users/entities/user.entity");
const createSuperAdmin = async (AppDataSource) => {
    const userRepository = AppDataSource.getRepository(user_entity_1.User);
    const notificationSettingRepository = AppDataSource.getRepository(user_notification_setting_entity_1.UserNotificationSetting);
    const isSuperAdminAlreadyExist = await userRepository.findOne({
        where: {
            email: 'superadmin@example.com',
        },
    });
    if (!isSuperAdminAlreadyExist) {
        const createSuperAdmin = userRepository.create({
            first_name: 'Super',
            last_name: 'Admin',
            email: 'superadmin@example.com',
            password: '123123',
            role: user_entity_1.UserRole.SUPER_ADMIN,
        });
        await createSuperAdmin.save();
        const notificationSettings = notificationSettingRepository.create({
            user: createSuperAdmin,
            is_email_enabled: true,
            is_in_app_enabled: true,
        });
        await notificationSettings.save();
        console.log('Super Admin Seeded Successfully');
    }
};
exports.createSuperAdmin = createSuperAdmin;
//# sourceMappingURL=super-admin.seed.js.map