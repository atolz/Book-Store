import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async createUser(user: CreateUserDto): Promise<User> {
    const created = this.userRepo.create(user);

    // console.log('created user', this.userRepo.save(created));
    return await this.userRepo.save(created);
  }
}
