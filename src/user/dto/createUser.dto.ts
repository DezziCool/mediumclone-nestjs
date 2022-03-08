import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}

// здесь не было раньше никаких ограничений, а это значит "ValidationPipe()" ничего не проверяел бы.
// Добавили декораторы для корректной валидации.
// "@IsNotEmpty()" - означает, что строка не должна быть пустой.
