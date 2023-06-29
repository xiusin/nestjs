import { InjectQueue } from '@nestjs/bull';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject, UseInterceptors, Param, Get, Post, Request, Req, Body } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, Ctx, MessagePattern, Payload, RedisContext, RmqContext, RmqRecordBuilder } from '@nestjs/microservices';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { Services } from 'src/constants';
import { UserLoginDto } from 'src/dto/user.dto';

@Controller('users')
// @UseInterceptors(CacheInterceptor) // 自动响应缓存数据
export class UsersController {
    constructor(
        // @Inject(Services.RabbitMQ) private client: ClientProxy,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(Services.Redis) private redis: ClientProxy,
        @InjectQueue('user') private readonly queue: Queue,
        private jwt: JwtService,
        private event: EventEmitter2
    ) {
    }

    @Post('/login')
    async login(@Body() userLoginDto: UserLoginDto) {
        return {
            access_token: await this.jwt.signAsync(userLoginDto),
            username: userLoginDto.username
        }
    }


    @Get('/:id')
    async getOne(@Param('id') id = '0') {
        let info = await this.cacheManager.get(id) as { id: string, name: string, tip?: string };
        if (info) {
            info.tip = 'cache';
        } else {
            info = { id: id, name: 'test' };
            await this.cacheManager.set(id, info, 0);
        }
        return info;
    }

    @MessagePattern('nestjs.xiusin.notifications')
    async handleUserMQMessage(@Payload() data, @Ctx() context: RmqContext) {
        console.log(`pattern ${context.getPattern()}, message: ${context.getMessage()}`);
    }


    @MessagePattern('notifications')
    async handleUserRedisMessage(@Payload() data, @Ctx() context: RedisContext) {
        console.log(`channel: ${context.getChannel()}, data: ${data} 【从redis内消费消息，不知道怎么移动到Service内】`);
    }


    @Get('/create/:name')
    async createUser(@Param('name') name: string, @Req() req: Request) {
        const message = "User created: " + name;

        const record = new RmqRecordBuilder(message)
            .setOptions({
                headers: {
                    ['x-version']: '1.0.0',
                },
                priority: 3
            }).build();

        await this.redis.emit('notifications', message);

        await this.event.emit('notifications', message);

        return `用户 ${name} 创建成功!`;
    }

    @Get('/send/:name')
    async send(@Param('name') name: string) {
        await this.queue.add('send', { mobile: '17610053500', name: name, 'content': '您的余额剩余：1000000000万元整😁!' })
        return '消息已投递队列';
    }
}
