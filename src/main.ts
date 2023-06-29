import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import compression from '@fastify/compress';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { Services } from './constants';
import configuration from './config/configuration';


function swag(app) {
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.register(compression, { encodings: ['gzip', 'deflate'] }); // 注册压缩

  const port = app.get(ConfigService).get<number>('port') || 5000;
  const host = app.get(ConfigService).get<string>('host') || '0.0.0.0';

  microservice(app); // TODO 注册微服务的服务端， 为什么要这样设计？
  swag(app); // 启用swagger

  await app.listen(5000, host);
  console.log(`Application is running on: http://${host}:${port}/`);
}

bootstrap();

// 必须在这里定义一次服务端，与客户端不一致
function microservice(app: NestFastifyApplication) {

  const config = app.get(ConfigService);

  app.connectMicroservice(config.get('redis'));

  // app.connectMicroservice(config.get('rabbitmq'));

  app.startAllMicroservices();
}