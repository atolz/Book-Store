import { Injectable } from '@nestjs/common';
import { EmailOptions } from './email.model';
const nodemailer = require('nodemailer');

export const enum EmailType {
  Verify = 'Verify',
}

@Injectable()
export class EmailService {
  async sendEmail(mailOptions: EmailOptions): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'atolz.me@gmail.com',
        pass: 'ouiw dtgf xgpc nrmz',
      },
    });

    await transporter.sendMail({ from: 'Book Store', ...mailOptions });

    return true;

    //  function (err, info) {
    //     if (err) console.log(err);
    //     else console.log(info);
    //   }
  }
}
