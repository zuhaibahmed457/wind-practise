import { IsNotEmpty } from 'class-validator';

export class AddDeviceTokenDto {
  @IsNotEmpty()
  device_token: string;
}
