/* eslint-disable prettier/prettier */
import {
  IsNumber,
  // IsNotEmpty,
  IsEnum,
  // Allow,
  IsArray,
  // ValidateIf,
  IsString,
  ArrayUnique,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BookGenres {
  Action = 'Action',
  Fantasy = 'Fantasy',
  Romance = 'Romance',
  Mystery = 'Mystery',
  ScienceFiction = 'ScienceFiction',
}

export class CreateBookDTO {
  @ApiProperty({
    description: 'Name of the book',
    example: 'Default book name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  // @IsDateString(
  //   { strict: true, strictSeparator: true },
  //   {
  //     message:
  //       'createDate must be a valid ISO 8601 date string eg: 2023-01-15T14:30:00.000Z or yyyy-mm-dd or yyyy-mm or yyyy - slashes not accepted',
  //   },
  // )
  // @Transform(({ value }) => {
  //   console.log('Transforming Date', value, new Date(value));
  //   if (isDateString(value)) {
  //     return new Date(value).toISOString();
  //   }
  //   return value;
  // })
  // @IsDate()
  // @ApiProperty({ format: 'date-time' })
  // createDate: string;
  @IsNumber()
  @ApiProperty()
  sales: number;
  @ApiProperty({
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  likes: number;
  @ApiProperty({
    enum: BookGenres,
    enumName: 'Book Genre',
    isArray: true,
    uniqueItems: true,
    // enum: ['Admin', 'Moderator', 'User'],
    example: [BookGenres.Romance, BookGenres.Action],
    // enum: [BookGenres.ACTION, BookGenres.ROMANCE],
    type: [String],
    // description: 'Specify an array of genre',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(BookGenres, { each: true })
  genre: BookGenres[];
  // @ApiProperty({ readOnly: true })
  // @IsEmpty()
  // test: string;
}

// export class UpdateBookDTO extends P
