import { Injectable } from '@nestjs/common';
import { OTPEntity } from './otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTPEntity) private otpRepo: Repository<OTPEntity>,
  ) {}

  async crateOTP(email: string): Promise<{ otp: string; expiresIn: string }> {
    const saltOrRounds = 10;
    const randPassword = `${Math.floor(Math.random() * 1000000)}`;
    const otpHash = await bcrypt.hash(randPassword, saltOrRounds);

    const otp = this.otpRepo.create({
      email: email,
      one_time_password: otpHash,
    });
    // console.log('otp is', otp);
    // otp.email = email;
    // otp.one_time_password = otpHash;

    // Set default value to 2 hours from the current time
    //  this.expiresAt = new Date();
    //  this.expiresAt.setHours(this.expiresAt.getHours() + 2);

    await this.otpRepo.save(otp);
    // console.log('otp is', newOtp, otp, otp.created_at);

    return {
      otp: randPassword,
      expiresIn: `2 Hours`,
    };
  }
}
