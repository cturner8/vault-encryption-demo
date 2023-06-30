import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({
    username,
    email,
    forename,
    surname,
    password,
  }: CreateUserDto) {
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      return Promise.reject(new BadRequestException('Username already taken.'));
    }

    const { salt, hash } = await this.generateHash(password);

    return this.prisma.user.create({
      data: {
        username,
        email,
        forename,
        surname,
        userHash: {
          create: {
            hash,
          },
        },
        userSalt: {
          create: {
            salt,
          },
        },
      },
    });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  findHashByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        userHash: true,
      },
    });
  }

  private async generateHash(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return { salt, hash };
  }

  async compareUserHash(userHash: string, inputPassword: string) {
    return bcrypt.compare(inputPassword, userHash);
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
