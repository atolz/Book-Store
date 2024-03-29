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
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { Public } from './public.decorator';
import { UserRolesEnum } from 'src/users/users.enum';
import { AuthorEntity } from 'src/users/author.entity';
import { AdminEntity } from 'src/users/admin.entity';
import { SignUpAuthorDTO } from './dtos/signup-author.dto';
import { RegisterAdminDTO } from './dtos/signup-admin.dto';
import { VerifyAccountOTPDTO } from './dtos/verify-account-otp.dto';
import { VerifyEmailOTPDTO } from './dtos/verify-email-otp.dto';

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

  @Public()
  @ApiQuery({
    name: 'type',
    enum: UserRolesEnum,
    description: 'Specify kind of account',
    style: 'spaceDelimited',
    required: false,
  })
  @Post('verify-email-otp')
  verifyAccount(
    @Body() data: VerifyEmailOTPDTO,
    @Query('type') type: UserRolesEnum,
  ): Promise<{ message: string }> {
    return this.authService.sendVerificationEmail(data.email, type);
  }

  @ApiResponse({ status: 200 })
  @Public()
  @Post('verify-account-otp')
  verifyOTP(@Body() details: VerifyAccountOTPDTO): Promise<any> {
    return this.authService.verifyAccount(details.email, details.otp);
  }

  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req: Request): Promise<User> {
    const { user } = req as { user?: { id: string; role: string } };
    return this.authService.getUser(user?.id, user?.role);
  }
}
