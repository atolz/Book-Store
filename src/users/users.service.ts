import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './users.entity';
import { UserRolesEnum } from './users.enum';
import { AdminEntity } from './admin.entity';
import { AuthorEntity } from './author.entity';
import { CreateWebPushNotificationDTO } from './dtos/create-web-push-notification.dto';
import { Cron } from '@nestjs/schedule';
// import webpush from 'web-push';
import { ConfigService } from '@nestjs/config';
const webpush = require('web-push');

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepo: Repository<AuthorEntity>,
    private configService: ConfigService,
  ) {}

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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(
    email: string,
    type: UserRolesEnum = UserRolesEnum.User,
    updateData: User & AdminEntity & AuthorEntity,
  ): Promise<User & AdminEntity & AuthorEntity> {
    let user;
    console.log('type user...', type, email);
    if (type == UserRolesEnum.User) {
      user = await this.userRepo.findOneBy({ email: email });
      user && this.userRepo.save({ ...user, ...updateData });
    }
    if (type == UserRolesEnum.Author) {
      user = await this.authorRepo.findOneBy({ email: email });
      user && this.authorRepo.save({ ...user, ...updateData });
    }
    if (type == UserRolesEnum.Admin) {
      user = await this.adminRepo.findOneBy({ email: email });
      user && this.adminRepo.save({ ...user, ...updateData });
    }
    console.log('user is', user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const created = this.userRepo.create(user);

    // console.log('created user', this.userRepo.save(created));
    return await this.userRepo.save(created);
  }

  async subscribeToWebPushNotification(
    userId: string,
    userType: UserRolesEnum,
    sub: CreateWebPushNotificationDTO,
  ): Promise<string> {
    const user = await this.getUser(userId, undefined, userType);

    user.webPushSubscription = sub;
    await this.userRepo.save(user);

    return 'Web Push Notification addedd successfully!';
  }

  @Cron('*/10 * * * * *', { name: 'web-push-notification' })
  async sendNotification() {
    this.logger.debug('Called when the second is 10');

    webpush.setVapidDetails(
      'mailto:atolz.me@gmail.com',
      this.configService.get<string>('Public_Key'),
      this.configService.get<string>('Private_Key'),
    );

    const users = await this.userRepo.findBy({
      webPushSubscription: Not('null'),
    });

    users?.forEach(async (el) => {
      console.log('sending push notification', el.webPushSubscription);
      try {
        await webpush.sendNotification(
          el.webPushSubscription,
          'A web push notification',
        );
      } catch (error) {
        this.logger.error(
          `Error sending push notification for user ${el.id}: ${error.message}`,
          error,
        );
        // You can log additional details or handle the error in a specific way
      }
    });

    // this.logger.log('Users subscribed are:');
    // console.log(users);
  }
}
