/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from 'class-validator';

export class VerifyAccountOTPDTO {
  @IsString()
  otp: string;
  @IsEmail()
  email: string;
}
