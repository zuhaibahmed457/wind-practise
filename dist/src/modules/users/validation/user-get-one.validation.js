"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOneUser = validateOneUser;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../entities/user.entity");
function validateOneUser(currentUser, user) {
    if (currentUser?.role === user_entity_1.UserRole.ADMIN) {
        if (user?.role === user_entity_1.UserRole.ADMIN && user?.id !== currentUser?.id) {
            throw new common_1.ForbiddenException("You are not allowed to view another admin's information");
        }
        if (user?.role === user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('You are not allowed to view super admin information');
        }
    }
}
//# sourceMappingURL=user-get-one.validation.js.map