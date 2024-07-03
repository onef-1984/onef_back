import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ReportModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/.env`],
      isGlobal: true,
      load: [jwtConfig],
    }),
    BookModule,
  ],
})
export class AppModule {}
