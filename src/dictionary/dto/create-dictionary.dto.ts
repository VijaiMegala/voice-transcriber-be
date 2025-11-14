import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDictionaryDto {
  @ApiProperty({
    description: 'Current word to be replaced',
    example: 'colour',
  })
  @IsNotEmpty()
  @IsString()
  currentWord: string;

  @ApiProperty({
    description: 'Replacement word',
    example: 'color',
  })
  @IsNotEmpty()
  @IsString()
  replacementWord: string;
}
