import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(SignUpDto) {
    @IsEnum([UserRole.ORGANIZATION, UserRole.TECHNICIAN, UserRole.ADMIN], {
        message: `role must be one of these: ${UserRole.ORGANIZATION}  ${UserRole.TECHNICIAN} OR ${UserRole.ADMIN}`,
      })
      @IsOptional()
      role: UserRole;
}
