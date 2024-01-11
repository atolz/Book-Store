import { Injectable } from '@nestjs/common';
const nodemailer = require('nodemailer');

@Injectable()
export class EmailService {
  async sendEmail(to: string, from: string): Promise<string> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'atolz.me@gmail.com',
        pass: 'ouiw dtgf xgpc nrmz',
      },
    });
    const mailOptions = {
      from: from, // sender address
      to: to, // list of receivers
      subject: 'First email test', // Subject line
      html: '<p>Your html here</p>', // plain text body
    };

    await transporter.sendMail(mailOptions);

    return 'Email has been sent...';

    //  function (err, info) {
    //     if (err) console.log(err);
    //     else console.log(info);
    //   }
  }
}
