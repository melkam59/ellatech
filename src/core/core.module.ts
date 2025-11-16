import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'src/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseinterceptor } from './interceptors/transform-response/transform-response.interceptor';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache/cache.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get<string>('redis.username');
        const password = configService.get<string>('redis.password');
        return {
          isGlobal: true,
          store: await redisStore({
            socket: {
              host: configService.get<string>('redis.host'),
              port: configService.get<number>('redis.port'),
            },
            ...(username && { username }),
            ...(password && { password }),
          }),
          ttl: 10000,
        };
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  providers: [
    CacheService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseinterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheService],
})
export class CoreModule {}
