import { IsEmail, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { RequestType } from '../entities/access-request.entity';
import { Transform } from 'class-transformer';

export class ViewAccessRequestDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  requested_by_id: string;
}
