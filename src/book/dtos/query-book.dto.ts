/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  //   IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BookGenres } from './create-book.dto';
// import { Transform } from 'class-transformer';

export class QueryBookDto {
  @ApiProperty({ required: false })
  @IsOptional()
  search: string;
  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number;
  @ApiProperty({ default: 100 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number;

  /**
   * @example 'Romance'
   */
  @ApiProperty({ required: false })
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
  genre?: string;
}
