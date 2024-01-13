/* eslint-disable prettier/prettier */
import { UserRolesEnum } from 'src/users/users.enum';
import {
  BeforeUpdate,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class OTPEntity {
  @Column()
  one_time_password: string;

  @Column({ type: 'enum', enum: UserRolesEnum, nullable: true })
  user_type: UserRolesEnum;

  @PrimaryColumn({ unique: true })
  email: string;

  @CreateDateColumn()
  created_at: Date;
  @Column({
    type: 'timestamp',
    nullable: true,
    // default: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    // default: () => 'CURRENT_TIMESTAMP',
  })
  expires_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setDefaultExpiresAt() {
    // Set default value to 2 hours from the current time
    this.expires_at = new Date();
    this.expires_at.setHours(this.expires_at.getHours() + 2);
  }
}
