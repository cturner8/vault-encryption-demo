import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignUpDto {
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

  @IsStrongPassword()
  @MinLength(8)
  confirmPassword: string;
}
