import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserRolesEnum } from './users.enum';
import { AdminEntity } from './admin.entity';
import { AuthorEntity } from './author.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    @InjectRepository(AuthorEntity)
    private authorRepo: Repository<AuthorEntity>,
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

  async createUser(user: CreateUserDto): Promise<User> {
    const created = this.userRepo.create(user);

    // console.log('created user', this.userRepo.save(created));
    return await this.userRepo.save(created);
  }
}
