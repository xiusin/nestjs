import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable() 
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: any, next: (error?: any) => void) {
        // console.log(req.url + ' request... '); // TODO 请求前后不一致?
        next();
        // console.log(req.url + ' end ... ');
    }
    
}