import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  forename: string;

  @IsNotEmpty()
  surname: string;

  @IsStrongPassword()
  @MinLength(8)
  password: string;
}
