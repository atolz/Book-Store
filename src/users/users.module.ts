import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthorEntity } from './author.entity';
import { AdminEntity } from './admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthorEntity, AdminEntity])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule],
})
export class UsersModule {}
