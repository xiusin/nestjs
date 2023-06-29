import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    // @Cron(CronExpression.EVERY_30_SECONDS)
    handleCron() {
        this.logger.log('handleCron Called every 30 seconds');
    }

    // @Interval(10000)
    handleInterval() {
        this.logger.log('handlerInterval Called every 10 seconds');
    }
}
