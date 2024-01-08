/* eslint-disable prettier/prettier */
import { Entity, Unique } from 'typeorm';
import { BaseUserModel } from './base-user.model';

@Entity()
@Unique('User with email already exist', ['email'])
export class User extends BaseUserModel {}
