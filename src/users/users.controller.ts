import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './users.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  /**
   * Create some user resource
   */
  constructor(private userService: UsersService) {}
  @Post('')
  createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.createUser(user);
  }
}
