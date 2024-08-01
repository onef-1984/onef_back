import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { BookModule } from './book/book.module';
import { validationSchema } from './config/validationSchema';
import { AladinModule } from './aladin/aladin.module';
import { AppController } from './app.controller';
import { RefreshMiddleware } from './middleware/refresh.middleware';
import { MiddlewareModule } from './middleware/middleware.module';
import { ImageModule } from './image/image.module';
import { awsConfig } from './config/aws.config';
import { baseConfig } from './config/base.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [jwtConfig, awsConfig, baseConfig],
      validationSchema,
    }),
    AuthModule,
    PrismaModule,
    ReportModule,
    UserModule,
    BookModule,
    AladinModule,
    MiddlewareModule,
    ImageModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RefreshMiddleware).forRoutes('*');
  }
}
