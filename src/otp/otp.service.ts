import { BadRequestException, Injectable } from '@nestjs/common';
import { OTPEntity } from './otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRolesEnum } from 'src/users/users.enum';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTPEntity) private otpRepo: Repository<OTPEntity>,
  ) {}

  async createOTP(
    email: string,
    userType: UserRolesEnum,
  ): Promise<{ otp: string; expiresIn: string }> {
    const saltOrRounds = 10;
    const randPassword = `${Math.floor(Math.random() * 1000000)}`;
    const otpHash = await bcrypt.hash(randPassword, saltOrRounds);

    const otp = this.otpRepo.create({
      email: email,
      one_time_password: otpHash,
      user_type: userType,
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

  async validateOTP(email: string, otp: string): Promise<OTPEntity> {
    const otpData = await this.otpRepo.findOneBy({
      email: email,
    });

    if (!otpData) {
      throw new BadRequestException('Invalid OTP');
    }

    const isCorrectOTP = await bcrypt.compare(otp, otpData.one_time_password);

    if (!isCorrectOTP) {
      throw new BadRequestException('Invalid OTP');
    }
    console.log('otp data is', otpData, isCorrectOTP);

    const currentTime = Date.now();
    const otpExpTime = otpData.expires_at.getTime();

    if (currentTime > otpExpTime) {
      throw new BadRequestException('OTP has expired');
    }
    // await this.otpRepo.delete({ email: email });

    return otpData;
  }
}
