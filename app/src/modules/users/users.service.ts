import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

  findAll(page = 0, size = 10, term: string) {
    return this.prisma.user.findMany({
      take: size,
      skip: page * size,
      where: term
        ? {
            OR: [
              {
                email: {
                  contains: term,
                },
              },
              {
                username: {
                  contains: term,
                },
              },
              {
                forename: {
                  contains: term,
                },
              },
              {
                surname: {
                  contains: term,
                },
              },
            ],
          }
        : {},
      orderBy: [
        {
          username: 'asc',
        },
        {
          forename: 'asc',
        },
        {
          surname: 'asc',
        },
      ],
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return Promise.reject(new NotFoundException());
    return user;
  }

  update(id: number, { email, forename, surname, username }: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        forename,
        surname,
        username,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.$transaction([
      this.prisma.userSalt.delete({
        where: {
          userId: id,
        },
      }),
      this.prisma.userHash.delete({
        where: {
          userId: id,
        },
      }),
      this.prisma.user.delete({
        where: {
          id,
        },
      }),
    ]);
  }
}
