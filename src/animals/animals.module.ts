import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CatsModule } from 'src/cats/cats.module';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { AnimalsController } from './animals.controller';

@Module({
    controllers: [AnimalsController],
    imports: [CatsModule], // 想要使用Cats内导出的服务，则需要引入
    exports: [CatsModule] // 导出Cats模块，个人理解是在其他模块引用AnimalsModule时可以直接使用Cats里的内容
})
export class AnimalsModule {
    // 使用中间件
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('animals');
    }


}
