import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserResponseInterface } from './types/userResponce.interface';
import { UserService } from './user.service';
import { User } from './decorators/user.decorators';
import { UserEntity } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe()) // проверяет наш body и то что мы передали в "createUserDto" - валидация
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    console.log(createUserDto);
    const user = await this.userService.createUser(createUserDto);
    return this.userService.builduserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.builduserResponse(user);
  }

  // идея в том, что на этот route могут заходить только залогиненные пользователи
  @Get('user')
  async currentUser(
    @User() user: UserEntity,
    @User('id') currentUserId: UserEntity,
  ): Promise<UserResponseInterface> {
    console.log('user', user);
    console.log('userId', currentUserId);
    return this.userService.builduserResponse(user);
  }
}

// наш middleware отрабатывается раньше чем декоратор @User()
