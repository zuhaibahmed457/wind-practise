import { ForbiddenException } from '@nestjs/common';
import { User, UserRole } from '../entities/user.entity';

export function validateOneUser(currentUser: User, user: User) {
  if (currentUser?.role === UserRole.ADMIN) {
    if (user?.role === UserRole.ADMIN && user?.id !== currentUser?.id) {
      throw new ForbiddenException(
        "You are not allowed to view another admin's information",
      );
    }
    if (user?.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to view super admin information',
      );
    }
  }
}
