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
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(':chatId')
  create(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() createMessageDto: CreateMessageDto,
    @Request() request: ExpressRequest
  ) {
    return this.messagesService.create(
      chatId,
      request['user']['sub'],
      createMessageDto
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':chatId')
  findAll(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Query('term') term: string,
    @Request() request: ExpressRequest
  ) {
    return this.messagesService.findAll(
      chatId,
      request['user']['sub'],
      page,
      size,
      term
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':chatId/:id')
  findOne(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('id', ParseIntPipe) id: number,
    @Request() request: ExpressRequest
  ) {
    return this.messagesService.findOne(chatId, request['user']['sub'], id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':chatId/:id')
  update(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('id', ParseIntPipe) id: number,
    @Request() request: ExpressRequest,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    return this.messagesService.update(
      chatId,
      request['user']['sub'],
      id,
      updateMessageDto
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':chatId/:id')
  remove(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('id', ParseIntPipe) id: number,
    @Request() request: ExpressRequest
  ) {
    return this.messagesService.remove(chatId, request['user']['sub'], id);
  }
}
