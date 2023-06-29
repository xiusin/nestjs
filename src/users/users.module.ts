import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { UserProcessor } from './user.processor';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserProcessor],
  imports: [
    EventEmitterModule.forRoot(),
    BullModule.registerQueue({ name: 'user' })
  ],
})
export class UsersModule { }
