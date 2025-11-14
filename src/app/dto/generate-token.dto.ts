import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class GenerateTokenDto {
  @ApiProperty({
    description: 'Name of the LiveKit room',
    example: 'room-123',
  })
  @IsNotEmpty()
  @IsString()
  roomName: string;

  @ApiProperty({
    description: 'Name of the participant joining the room',
    example: 'user-123',
  })
  @IsNotEmpty()
  @IsString()
  participantName: string;

  @ApiProperty({
    description:
      'Language code for transcription (ISO 639-1 format). Use "multi" for automatic language detection. Supported: en, es, fr, de, it, pt, nl, zh, ja, ko, id, tr, ru, hi, multi',
    example: 'en',
    required: false,
    default: 'en',
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'en',
    'es',
    'fr',
    'de',
    'it',
    'pt',
    'nl',
    'zh',
    'ja',
    'ko',
    'id',
    'tr',
    'ru',
    'hi',
    'multi',
  ])
  language?: string;
}
