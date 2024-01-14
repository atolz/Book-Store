/* eslint-disable prettier/prettier */
import { Column, Entity, Unique } from 'typeorm';
import { BaseUserModel } from './base-user.entity';

export enum AdminPrivilege {
  Super = 'Super',
  Read = 'Read',
}

@Entity('admin')
@Unique('Admin with email already exist', ['email'])
export class AdminEntity extends BaseUserModel {
  @Column()
  secretUsed?: string;

  @Column({
    type: 'enum',
    enum: AdminPrivilege,
    array: true,
    default: [AdminPrivilege.Super],
  })
  priviledges?: AdminPrivilege[];
}
