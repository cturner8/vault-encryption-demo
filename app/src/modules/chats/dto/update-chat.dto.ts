import { OmitType } from '@nestjs/mapped-types';
import { IsArray } from 'class-validator';
import { CreateChatDto } from './create-chat.dto';

export class UpdateChatDto extends OmitType(CreateChatDto, ['encrypted']) {
  @IsArray()
  override members: number[];
}
