/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseUserModel } from './base-user.model';
import { Book } from 'src/book/book.entity';

@Entity('author')
@Unique('Author with email already exist', ['email'])
export class AuthorEntity extends BaseUserModel {
  @Column({ type: 'timestamp', nullable: true })
  yearStarted?: Date;

  @Column({ type: 'boolean', default: false })
  verified?: boolean;

  @OneToMany(() => Book, (book) => book.author, { eager: false })
  books?: Book[];
}
