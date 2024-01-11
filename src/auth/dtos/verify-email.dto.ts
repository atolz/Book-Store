/* eslint-disable prettier/prettier */
import { IsEmail } from 'class-validator';

/* eslint-disable prettier/prettier */
export class VerifyEmailDTO {
  /**
   * @example 'ade@gmail.com'
   */
  @IsEmail()
  email: string;
}
