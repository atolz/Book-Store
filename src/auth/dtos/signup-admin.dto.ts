/* eslint-disable prettier/prettier */
import { IsEnum, IsString } from 'class-validator';
import { signUpDto } from './singup.dto';
import { AdminPrivilege } from 'src/users/admin.entity';

export class RegisterAdminDTO extends signUpDto {
  @IsString()
  secret?: string;
  @IsEnum(AdminPrivilege, { each: true })
  priviledges?: AdminPrivilege[];
}
