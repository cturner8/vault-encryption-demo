import { IsArray } from 'class-validator';
import { CreateChatDto } from './create-chat.dto';

export class UpdateChatDto extends CreateChatDto {
  @IsArray()
  override members: number[];
}
