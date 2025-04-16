import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID('all', { message: 'invalid id' })
  @IsString()
  @IsNotEmpty()
  plan_id: string;
}
