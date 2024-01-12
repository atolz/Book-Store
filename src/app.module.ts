import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
// import { UserEntity } from './users/users.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';
import { OtpService } from './otp/otp.service';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    BookModule,
    UsersModule,
    AuthModule,
    EmailModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '54321',
      database: 'Books Store',
      // entities: [UserEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'secrete',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, OtpService],
})
export class AppModule {}
