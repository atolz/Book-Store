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
    enum: UserRolesEnum,
    type: 'enum',
  })
  role: UserRolesEnum;

  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true, select: false })
  password: string;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  webPushSubscription: {
    endpoint: string;
    keys: {
      auth: string;
      p256dh: string;
    };
  };

  @Column({ default: () => 'NOW()' })
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
