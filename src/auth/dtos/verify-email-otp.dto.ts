/* eslint-disable prettier/prettier */
import { IsEmail } from 'class-validator';

/* eslint-disable prettier/prettier */
export class VerifyEmailOTPDTO {
  /**
   * @example 'ade@gmail.com'
   */
  @IsEmail()
  email: string;
}
