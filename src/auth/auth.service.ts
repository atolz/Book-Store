import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { signInDto } from './dtos/singin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRolesEnum } from 'src/users/users.enum';
import { AdminEntity } from 'src/users/admin.entity';
import { AuthorEntity } from 'src/users/author.entity';
import { signUpDto } from './dtos/singup.dto';
import { SignUpAuthorDTO } from './dtos/signup-author.dto';
import { RegisterAdminDTO } from './dtos/signup-admin.dto';
import { EmailService } from 'src/email/email.service';
import { EmailOptions } from 'src/email/email.model';
import { OtpService } from 'src/otp/otp.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepo: Repository<AuthorEntity>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private otpService: OtpService,
    private userService: UsersService,
  ) {}

  async genToken(user: User) {
    return await this.jwtService.signAsync({
      id: user?.id,
      email: user?.email,
      role: user.role,
    });
  }

  async getUser(
    id?: string,
    email?: string,
    type: UserRolesEnum = UserRolesEnum.User,
    selectPass: boolean = false,
  ): Promise<User & AdminEntity & AuthorEntity> {
    let user;
    console.log('type user...', type, email, id);
    if (type == UserRolesEnum.User) {
      user = await this.userRepo.findOne({
        where: { id: id, email },
        select: selectPass ? ['password'] : undefined,
      });
    }
    if (type == UserRolesEnum.Author) {
      user = await this.authorRepo.findOne({
        where: { id: id, email },
        select: selectPass ? ['id', 'password'] : undefined,
      });
    }
    if (type == UserRolesEnum.Admin) {
      user = await this.adminRepo.findOne({
        where: { id: id, email },
        select: selectPass ? ['id', 'password'] : undefined,
      });
    }
    console.log('user is', user);
    return user;
  }

  async signIn(
    credentials: signInDto,
    type: UserRolesEnum,
  ): Promise<User | any> {
    const user = await this.getUser(undefined, credentials.email, type);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userPass = (
      await this.getUser(undefined, credentials.email, type, true)
    ).password;
    console.log('user spass', userPass);

    const isCorrectPassword = await bcrypt.compare(
      credentials.password,
      userPass,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Username or password is not correct!');
    }

    const token = await this.genToken(user);

    return { data: { ...user, password: undefined }, token };
  }

  async signUp(
    data: signUpDto & SignUpAuthorDTO & RegisterAdminDTO,
    type: string = UserRolesEnum.User,
  ): Promise<User | any> {
    let user: User & AdminEntity & AuthorEntity;
    let newUser: User & AdminEntity & AuthorEntity;
    let updatedData: User & AdminEntity & AuthorEntity;

    if (type == UserRolesEnum.User) {
      user = this.userRepo.create(data);
      user.role = UserRolesEnum.User;
      newUser = await this.userRepo.save(user);
    }
    if (type == UserRolesEnum.Admin) {
      if (data.secret == 'admin_secret_key') {
        user = this.adminRepo.create(data);
        user.role = UserRolesEnum.Admin;
        user.secretUsed = data.secret;
        newUser = await this.adminRepo.save(user);
      } else {
        throw new ForbiddenException('Nice try buddy...🤣');
      }
    }
    if (type == UserRolesEnum.Author) {
      user = this.authorRepo.create(data);
      user.role = UserRolesEnum.Author;
      newUser = await this.authorRepo.save(user);
    }

    console.log('starting hashing...');
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password, saltOrRounds);

    user.password = hash;

    // const updatedData = await this.userRepo
    //   .createQueryBuilder()
    //   .update()
    //   .set({ password: hash })
    //   .where('id = :id', { id: user.id })
    //   .returning(['id', 'email', 'role', 'phone'])
    //   .execute();

    if (type == UserRolesEnum.User) {
      updatedData = await this.userRepo.save(user);
    }
    if (type == UserRolesEnum.Admin) {
      updatedData = await this.adminRepo.save(user);
    }
    if (type == UserRolesEnum.Author) {
      updatedData = await this.authorRepo.save(user);
    }

    // const updatedData = await this.userRepo.save(user);
    // const updatedData = await this.userRepo.update(newUser.id, user);

    console.log('let updated ', updatedData);

    const token = await this.genToken(newUser);

    return {
      data: newUser,
      token,
    };
  }

  async sendVerificationEmail(
    email: string,
    userType: UserRolesEnum,
  ): Promise<{ message: string }> {
    const user = await this.userService.getUser(undefined, email, userType);

    const otp = await this.otpService.crateOTP(user.email);
    const emailOptions = new EmailOptions();
    emailOptions.to = user.email;
    emailOptions.html = `<p>Your OTP is: ${otp.otp}</p>
    <p>Expires In: ${otp.expiresIn}</p>
    `;
    emailOptions.subject = 'Verify Your Email';

    await this.emailService.sendEmail(emailOptions);

    return { message: 'Verification email has been sent to your email.' };
  }
}
