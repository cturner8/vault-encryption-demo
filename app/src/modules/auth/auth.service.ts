import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async signIn({ username, password }: SignInDto) {
    const user = await this.usersService.findHashByUsername(username);
    if (!user || !user.userHash) {
      return Promise.reject(new UnauthorizedException());
    }

    const { hash } = user.userHash;
    const passwordMatch = await this.usersService.compareUserHash(
      hash,
      password
    );

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const { id: sub, email, forename, surname } = user;
    const payload = { sub, username, email, forename, surname };

    return Promise.resolve({
      access_token: await this.jwtService.signAsync(payload),
    });
  }

  async signUp({ password, confirmPassword, ...dto }: SignUpDto) {
    if (password !== confirmPassword) {
      return Promise.reject(new BadRequestException('Passwords do not match.'));
    }
    return this.usersService.create({ password, ...dto });
  }
}
