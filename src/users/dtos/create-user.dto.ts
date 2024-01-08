/* eslint-disable prettier/prettier */
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;
  /**
   * A list of user's roles
   * @example love@gmail.com
   */

  @IsEmail()
  email: string;
  /**
   * User phone number in international format
   * @example '+234 079584849'
   */
  @IsPhoneNumber()
  phone: string;
}
