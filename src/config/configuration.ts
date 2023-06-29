import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Transport } from "@nestjs/microservices";
import { join } from "path";
import { Services } from "src/constants";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  },
  rabbitmq: {
    name: Services.RabbitMQ,
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://xiusin:ccb159781@localhost:5672'],
      queue: 'nestjs.xiusin.notifications',
      noAck: false,
      replyQueue: 'nestjs.xiusin.replies',
      queueOptions: {
        durable: false,
      },
    },
  },
  redis: {
    name: Services.Redis,
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
      password: 'yuAU702G!!',
      wildcards: true,
      db: 0,
    }
  },
  pgsql: {
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: 'db2e57200cda4043e4bd848d434f590854MCB_db',
    user: 'xiusin', // 数据库用户名
    password: 'Q9ANXDWizMr4', // 数据库密码
    host: '47.100.38.198', // 数据库主机名
    port: 5433, // 数据库端口号
    type: 'postgresql', // 数据库类型
    driver: PostgreSqlDriver, // 驱动程序
    debug: true,
    autoLoadEntities: true
  },
  grpc: {
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, 'hero/hero.proto'),
    },
  }
});