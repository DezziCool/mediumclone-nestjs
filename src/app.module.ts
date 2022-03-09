import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@app/ormconfig';
import { UserModule } from './user/user.module';
import { authMiddleware } from './user/middlewares/auth.middleware';

@Module({
  imports: [UserModule, TagModule, TypeOrmModule.forRoot(ormconfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // сделали глобальный "middleware"
    consumer.apply(authMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}

// forRoot() - передаем конфиг на вход модуля "TypeOrmModule"
// когда нам необходимо применить "middleware" - мы описываем ее с помощью конфига
// и внутри его пишем "consumer.apply"
