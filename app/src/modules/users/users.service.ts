import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ username, email, forename, surname }: CreateUserDto) {
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      return Promise.reject(
        new HttpException('Username already taken.', HttpStatus.BAD_REQUEST)
      );
    }

    return this.prisma.user.create({
      data: {
        username,
        email,
        forename,
        surname,
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
