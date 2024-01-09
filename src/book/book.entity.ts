/* eslint-disable prettier/prettier */
// import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BookGenres } from './dtos/create-book.dto';
import { AuthorEntity } from 'src/users/author.entity';

@Entity()
@Unique('UQ_NAMES_AND_AUTHOR', ['name', 'author'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;

  @ManyToOne(() => AuthorEntity, (author) => author.books, { cascade: true })
  author: AuthorEntity;

  @Column()
  sales: number;
  @Column()
  likes: number;
  @Column({
    type: 'enum',
    enum: BookGenres,
    array: true,
  })
  genre: BookGenres[];
  @BeforeInsert()
  @BeforeUpdate()
  ensureUniqueGenres() {
    // Ensure that the genres array is unique
    const uniqueGenres = [...new Set(this.genre)];
    this.genre = uniqueGenres;
  }
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
