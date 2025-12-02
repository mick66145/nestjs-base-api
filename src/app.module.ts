import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// import { BullModule } from '@nestjs/bullmq';
// import { ScheduleModule } from '@nestjs/schedule';
import { configLoads } from './config';
// import { RedisConfigInterface } from './config/redis/redis-config.interface';
import { LoggerModule } from './_libs/logger/logger.module';
import { LoggerMiddleware } from './_libs/logger/logger.middleware';
import { PrismaModule } from './_libs/prisma/prisma.module';
import { JwtConfigInterface } from './_libs/auth/jwt-config.interface';
import { PostModule } from './_examples/post/post.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configLoads,
    }), // ref: https://docs.nestjs.com/techniques/configuration
    // BullModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => {
    //     const redis = configService.get<RedisConfigInterface>('redis');
    //     return {
    //       connection: {
    //         host: redis?.host || 'localhost',
    //         port: redis?.port || 6379,
    //       },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    // ScheduleModule.forRoot(), // ref: https://docs.nestjs.com/techniques/task-scheduling
    LoggerModule,
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        const jwt = configService.getOrThrow<JwtConfigInterface>('jwt');

        return {
          secret: jwt.secret,
          signOptions: { expiresIn: jwt.expires },
        };
      },
      inject: [ConfigService],
    }),
    PostModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
