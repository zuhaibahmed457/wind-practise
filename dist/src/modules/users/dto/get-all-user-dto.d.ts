import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { UserRole, UserStatus } from '../entities/user.entity';
export declare class GetAllUserDto extends GetAllDto {
    role: UserRole;
    status: UserStatus;
    date_from: Date;
    date_to: Date;
}
