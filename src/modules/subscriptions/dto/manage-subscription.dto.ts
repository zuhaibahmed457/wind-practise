import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum SubscriptionActions {
  CANCEL = 'cancel',
  RENEW = 'renew',
}

export class ManageSubscriptionDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionActions)
  action: SubscriptionActions;
}
