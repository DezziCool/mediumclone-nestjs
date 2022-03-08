import { UserEntity } from '../user.entity';

export type UserType = Omit<UserEntity, 'hashPassword'>;
// создаем тип данных, но без поля "hashPassword"
