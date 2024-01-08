import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  // UseGuards,
} from '@nestjs/common';
import { signInDto } from './dtos/singin.dto';
import { AuthService } from './auth.service';
import { signUpDto } from './dtos/singup.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { Public } from './public.decorator';
import { UserRolesEnum } from 'src/users/users.enum';
import { AuthorEntity } from 'src/users/author.entity';
import { AdminEntity } from 'src/users/admin.entity';
import { SignUpAuthorDTO } from './dtos/signup-author.dto';
import { RegisterAdminDTO } from './dtos/signup-admin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/sigin')
  @ApiQuery({
    name: 'type',
    enum: UserRolesEnum,
    description: 'Specify kind of login',
    style: 'spaceDelimited',
  })
  async signIn(
    @Body() credentials: signInDto,
    @Query('type') type: UserRolesEnum,
  ): Promise<User> {
    return this.authService.signIn(credentials, type);
  }

  @Public()
  @Post('signup')
  signUp(@Body() details: signUpDto): Promise<User> {
    return this.authService.signUp(details);
  }

  @Public()
  @Post('signup/author')
  signUpAuthor(@Body() details: SignUpAuthorDTO): Promise<AuthorEntity> {
    return this.authService.signUp(details, UserRolesEnum.Author);
  }

  @Public()
  @Post('signup/admin')
  signUpAdmin(@Body() details: RegisterAdminDTO): Promise<AdminEntity> {
    return this.authService.signUp(details, UserRolesEnum.Admin);
  }

  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req: Request): Promise<User> {
    const { user } = req as { user?: { id: string; role: string } };
    return this.authService.getUser(user?.id, user?.role);
  }
}
