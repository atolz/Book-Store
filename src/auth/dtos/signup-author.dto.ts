/* eslint-disable prettier/prettier */
import { IsDateString, IsOptional } from 'class-validator';
import { signUpDto } from './singup.dto';

export class SignUpAuthorDTO extends signUpDto {
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'yearStarted must be a valid ISO 8601 date string eg: 2023-01-15T14:30:00.000Z or yyyy-mm-dd or yyyy-mm or yyyy - slashes not accepted',
    },
  )
  yearStarted?: string;
}
