import { UserNotificationSetting } from 'src/modules/notifications/entities/user-notification-setting.entity';
import { User, UserRole } from 'src/modules/users/entities/user.entity';
import { DataSource } from 'typeorm';

export const createSuperAdmin = async (AppDataSource: DataSource) => {
  const userRepository = AppDataSource.getRepository(User);
  const notificationSettingRepository = AppDataSource.getRepository(
    UserNotificationSetting,
  );

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
      role: UserRole.SUPER_ADMIN,
    });

    await createSuperAdmin.save();

    // Create notification settings for the super admin
    const notificationSettings = notificationSettingRepository.create({
      user: createSuperAdmin, // Link the newly created user
      is_email_enabled: true,
      is_in_app_enabled: true,
    });

    await notificationSettings.save();

    console.log('Super Admin Seeded Successfully');
  }
};
