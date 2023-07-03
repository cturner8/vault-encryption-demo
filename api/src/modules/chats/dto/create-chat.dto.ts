import { ArrayNotEmpty, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  name: string;

  @ArrayNotEmpty()
  members: number[];

  @IsBoolean()
  encrypted: boolean;
}
