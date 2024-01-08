/* eslint-disable prettier/prettier */
import {
  Column,
  // Index,
  PrimaryGeneratedColumn,
  // Unique,
  // CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRolesEnum } from './users.enum';

export abstract class BaseUserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  // @Column({ unique: true, type: 'text' })
  @Column({})
  email: string;
  @Column({
    default: UserRolesEnum.User,
    select: false,
    enum: UserRolesEnum,
    type: 'enum',
  })
  role: UserRolesEnum;

  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true, select: false })
  password: string;

  @Column({ default: () => 'NOW()' })
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
