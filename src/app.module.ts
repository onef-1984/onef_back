import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig, validationSchema } from './config/jwt.config';
import { BookModule } from './book/book.module';
import { AladinModule } from './aladin/aladin.module';
import { AppController } from './app.controller';
import { RefreshMiddleware } from './middleware/refresh.middleware';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [jwtConfig],
      validationSchema,
    }),
    AuthModule,
    PrismaModule,
    ReportModule,
    UserModule,
    BookModule,
    AladinModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RefreshMiddleware).forRoutes('*');
  }
}
