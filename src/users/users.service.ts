import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class UsersService {

    @OnEvent('notifications')
    handleMessage(message: string) {
        console.log(`Received message: ${message}, 消费源为【EventEmitter2】,个人理解，此模块为系统内部发布订阅队列和事件系统。`);
    }
}
