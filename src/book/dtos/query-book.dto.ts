/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  //   IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { BookGenres } from './create-book.dto';
// import { Transform } from 'class-transformer';

export class QueryBookDto {
  //   @ApiQuery({ description: 'de' })
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  @ValidateIf((val) => val.limit)
  page: number;
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  @ValidateIf((val) => val.page)
  limit: number;
  @ApiProperty()
  @IsString()
  @IsOptional()
  //   @IsArray()
  //   @Transform((o) => {
  //     // o.value = JSON.parse(`${o.value}`);
  //     // eror
  //     console.log('trasnforming', JSON.parse(o.value) as string[], `${o.value}`);
  //     return o;
  //   })
  @IsEnum(BookGenres, { each: true })
  genre: string;
}
