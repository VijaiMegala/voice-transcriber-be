import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateDictionaryDto {
  @ApiProperty({
    description: 'Current word to be replaced',
    example: 'colour',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  currentWord?: string;

  @ApiProperty({
    description: 'Replacement word',
    example: 'color',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  replacementWord?: string;
}
