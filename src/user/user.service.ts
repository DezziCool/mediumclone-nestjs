import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './types/userResponce.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponce = {
      errors: {
        'email or password': 'is invalid',
      },
    };
    const user = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      { select: ['id', 'username', 'bio', 'password'] }, // указываем какие поля хотим получить. Только так можем вытащить колокнку 'password'.
    );

    if (!user) {
      throw new HttpException(errorResponce, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect: boolean = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponce, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    console.log('Login user - ', user.username);
    user.password = loginUserDto.password;
    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const errorResponce = {
      errors: {},
    };
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByName = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (userByEmail) {
      errorResponce.errors['email'] = 'has already been taken';
    }

    if (userByName) {
      errorResponce.errors['username'] = 'has already been taken';
    }
    if (userByEmail || userByName) {
      throw new HttpException(errorResponce, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const newUser = new UserEntity(); // реализовать сохранение пользователя
    Object.assign(newUser, createUserDto); // мутируем объект "newUser"
    return await this.userRepository.save(newUser); // сохрванение пользователя внутри БД
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto); // мутируем объект
    return await this.userRepository.save(user);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  builduserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}

// мы будем мутировать данные, а не создавать новый объект, потому что нам нужно чтобы "newUser" остался без изменений
