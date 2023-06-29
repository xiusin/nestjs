import { Process, Processor } from "@nestjs/bull";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor('user')
@Injectable()
export class UserProcessor {
    private readonly logger = new Logger(UserProcessor.name);

    @Process('send')
    handleTranscode(job: Job) {
        this.logger.debug('Start send...');
        this.logger.debug(JSON.stringify(job.data));
        this.logger.debug('Send completed');
    }
}