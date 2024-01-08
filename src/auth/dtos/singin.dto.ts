/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from 'class-validator';

export class signInDto {
  /** @example 'love@gmail.com' */
  @IsEmail()
  email: string;
  /**@example 'passsord' */
  @IsString()
  password: string;
}
