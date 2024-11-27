import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { BookModule } from './book/book.module';
import { validationSchema } from './config/validationSchema';
import { AppController } from './app.controller';
import { RefreshMiddleware } from './middleware/refresh.middleware';
import { MiddlewareModule } from './middleware/middleware.module';
import { ImageModule } from './image/image.module';
import { awsConfig } from './config/aws.config';
import { baseConfig } from './config/base.config';
import { UtilModule } from './util/util.module';
import { ReportLikesModule } from './report-likes/report-likes.module';
import { EditorsPickModule } from './editors-pick/editors-pick.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { keyConfig } from './config/key.config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      path: '/api/graphql',
    }),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === undefined
          ? '.env.local'
          : `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [jwtConfig, awsConfig, baseConfig, keyConfig],
      validationSchema,
    }),
    AuthModule,
    PrismaModule,
    ReportModule,
    UserModule,
    BookModule,
    MiddlewareModule,
    ImageModule,
    UtilModule,
    ReportLikesModule,
    EditorsPickModule,
    CommentModule,
    NotificationModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RefreshMiddleware).forRoutes('*');
  }
}
