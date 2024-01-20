import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './users.entity';
import { CreateWebPushNotificationDTO } from './dtos/create-web-push-notification.dto';
import { UserRolesEnum } from './users.enum';

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

  @ApiBearerAuth()
  @Post('/sub-web-push-notification')
  subscribeToWebPushNotification(
    @Body() sub: CreateWebPushNotificationDTO,
    @Request() req: Request,
  ): Promise<string> {
    const { user } = req as { user?: { id: string; role: UserRolesEnum } };

    return this.userService.subscribeToWebPushNotification(
      user.id,
      user.role,
      sub,
    );
  }
}
