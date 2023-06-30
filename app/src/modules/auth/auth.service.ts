import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin-dto';
import { SignUpDto } from './dto/signup-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn({ username }: SignInDto) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return Promise.reject(new UnauthorizedException());
    }
    // if (user?.password !== pass) {
    //   throw new UnauthorizedException();
    // }
    // const { password, ...result } = user;

    // TODO: Generate a JWT and return it here
    // instead of the user object

    const { id: sub, email, forename, surname } = user;

    const payload = { sub, username, email, forename, surname };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(dto: SignUpDto) {
    return this.usersService.create(dto);
  }
}
