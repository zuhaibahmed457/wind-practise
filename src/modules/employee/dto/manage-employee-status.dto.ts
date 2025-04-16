import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from 'src/modules/users/entities/user.entity';

export class ManageEmployeeStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
