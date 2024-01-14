import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
import { SwaggerAPIResponse } from './utils/swagger-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    type: SwaggerAPIResponse,
    description: 'General API response format',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
