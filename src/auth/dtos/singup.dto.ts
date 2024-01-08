/* eslint-disable prettier/prettier */
import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class signUpDto {
  /**
   * A list of user's roles
   * @example 'Fola Jimyy'
   */
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
  /**
   * @example 'password'
   *  */
  @IsString()
  @MinLength(4)
  password: string;
}
