import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

// @Global() // 如果很多地方都需要使用此模块，就会造成其他模块内均要手动引入一次， 可以使用Global使其变成全局模块
@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService] // 将服务导出为共享服务 
})
export class CatsModule {}
