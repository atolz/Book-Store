/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class SwaggerAPIResponse {
  constructor(
    data: any,
    message: string = 'Success',
    status: boolean = true,
    statusCode: number = 200,
  ) {
    this.message = message;
    this.status = status;
    this.statusCode = statusCode;
    this.data = data;
  }

  @ApiProperty({
    description: 'Message',
  })
  @IsString()
  @ApiProperty()
  message: string;
  @IsBoolean()
  @ApiProperty()
  status: boolean;
  @IsNumber() statusCode: number;
  @ApiProperty()
  data: any;
}
