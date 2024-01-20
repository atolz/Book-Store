/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class Keys {
  @IsString()
  @IsNotEmpty()
  auth: string;

  @IsString()
  @IsNotEmpty()
  p256dh: string;
}

export class CreateWebPushNotificationDTO {
  @IsString()
  @IsNotEmpty()
  endpoint: string;
  @IsNotEmptyObject()
  @ValidateNested()
  keys: Keys;
}
