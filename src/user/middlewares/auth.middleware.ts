import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interfaces';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserService } from '../user.service';

@Injectable()
export class authMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  // Проверяем есть ли у нас токен в headers
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      console.log('bad user');
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1]; // вытягиваем токен - он у нас лежит вторым параметром
    // console.log('token', token);
    try {
      const decode = verify(token, JWT_SECRET);
      const user = await this.userService.findById(decode.id);
      req.user = user;
      // console.log(decode);
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}

// мы можем зарегистрировать middleware на какие то определенные роуты
// мы хотим сделать его глобальной для нашего проекта
// У "Express" изначально нет поля поля "user". Мы могли бы написать "req: any" - но это плохой фикс
// хороший фикс является расширение интерфейса "Express'a".
// мы сделали расширение для нашего Request с помощью доп. интерфейса.

// Наш midlleware зарегистрирован в app.module, поэтому при запуске выводит ошибкис предупреждениями, такие как:
// Potential solutions:
// - If UserService is a provider, is it part of the current AppModule?
// - If UserService is exported from a separate @Module, is that module imported within AppModule?

// мы не хотим здесь выводить какие либо ошибки, т.к. мы сделали его глобально для всех запросов
