import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponce.interface';
import { UserService } from './user.service';

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
}
