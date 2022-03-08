import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // те сущности, которые здесь прописаны - будут доступны внутри модуля service
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

//"forFeature()" - позволяет  внедрить "@InjectRepository(UserEntity)" в наш файл service
