import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { BookModule } from './book/book.module';
import { AladinModule } from './aladin/aladin.module';
import { AppController } from './app.controller';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ReportModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [jwtConfig],
    }),
    BookModule,
    AladinModule,
    UtilModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
