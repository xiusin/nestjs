import { Inject, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MikroOrmModule, MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { CatsModule } from './cats/cats.module';
import { AnimalsModule } from './animals/animals.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CatsController } from './cats/cats.controller';
import { UsersModule } from './users/users.module';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import configuration from './config/configuration';
import { ClientProviderOptions, ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from './constants';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }), // 全局模块，无需在其他模块内再次导入
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    ClientsModule.register({ clients: [configuration().redis as ClientProviderOptions], isGlobal: true }), // configuration().rabbitmq as ClientProviderOptions, 
    MikroOrmModule.forRoot(configuration().pgsql as MikroOrmModuleAsyncOptions),
    BullModule.forRoot({ redis: { host: "localhost", port: 6379, password: 'yuAU702G!!', db: 0, name: 'nestjs.queue.bull' }, prefix: 'nestjs.' }),
    JwtModule.register({ global: true, secret: 'db2e57200cda4043e4bd848d434f590854MCB', signOptions: { expiresIn: '3600s' } }),
    UsersModule
  ],
  providers: [TaskService],
})

// 在Nest内，一般Module被默认注册为单例
export class AppModule implements NestModule { // 实现NestModule接口使用中间件服务

  constructor(
    // @Inject(Services.RabbitMQ) private client: ClientProxy,
    @Inject(Services.Redis) private redis: ClientProxy
  ) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).exclude(
      { path: 'cats', method: RequestMethod.PATCH }, // 排除一些路由
      "cats/(patch-*.)"
    ).forRoutes(CatsController) // 为CatsController下的路由应用中间件
  }

  async onApplicationBootstrap() {
    await this.redis.connect();
    // await this.client.connect();
  }
}
