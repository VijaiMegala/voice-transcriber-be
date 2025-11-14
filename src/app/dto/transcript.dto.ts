import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
}
