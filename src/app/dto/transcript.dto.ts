import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class TranscriptDto {
  @ApiProperty({
    description: 'Name of the LiveKit room',
    example: 'room-123',
  })
  @IsNotEmpty()
  @IsString()
  roomName: string;

  @ApiProperty({
    description: 'Transcript text content',
    example: 'Hello, this is a transcript of the conversation.',
  })
  @IsNotEmpty()
  @IsString()
  transcript: string;

  @ApiProperty({
    description: 'Language code of the transcript (ISO 639-1 format)',
    example: 'en',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;
}
