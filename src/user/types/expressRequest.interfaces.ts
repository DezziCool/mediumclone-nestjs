import { Request } from 'express';
import { UserEntity } from '../user.entity';

export interface ExpressRequestInterface extends Request {
  user?: UserEntity;
}

// extends - получить все типы данных, которые содержатся в стандартном Request Express.
// UserEntity - исопьзуем чистую сущность БД
