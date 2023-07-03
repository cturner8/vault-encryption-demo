import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';

import { Request as ExpressRequest } from 'express';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { RemoveMembersDto } from './dto/remove-members-dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createChatDto: CreateChatDto,
    @Request() request: ExpressRequest
  ) {
    return this.chatsService.create(createChatDto, request['user']['sub']);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Query('term') term: string,
    @Request() request: ExpressRequest
  ) {
    return this.chatsService.findAll(request['user']['sub'], page, size, term);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: ExpressRequest
  ) {
    return this.chatsService.findOne(id, request['user']['sub']);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChatDto: UpdateChatDto,
    @Request() request: ExpressRequest
  ) {
    return this.chatsService.update(id, request['user']['sub'], updateChatDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: ExpressRequest
  ) {
    return this.chatsService.remove(id, request['user']['sub']);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/members')
  removeMembers(
    @Body() removeMembersDto: RemoveMembersDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() request: ExpressRequest
  ) {
    return this.chatsService.removeMembers(
      id,
      request['user']['sub'],
      removeMembersDto.members
    );
  }
}
