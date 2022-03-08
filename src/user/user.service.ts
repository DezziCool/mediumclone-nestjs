import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity(); // реализовать сохранение пользователя
    Object.assign(newUser, createUserDto); // мутируем объект "newUser"
    return await this.userRepository.save(newUser); // сохрванение пользователя внутри БД
  }
}

// мы будем мутировать данные, а не создавать новый объект, потому что нам нужно чтобы "newUser" остался без изменений
