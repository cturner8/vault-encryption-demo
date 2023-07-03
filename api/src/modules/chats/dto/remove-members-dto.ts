import { ArrayNotEmpty } from 'class-validator';

export class RemoveMembersDto {
  @ArrayNotEmpty()
  members: number[];
}
