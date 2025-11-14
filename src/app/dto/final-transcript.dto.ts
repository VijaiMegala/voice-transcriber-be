import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FinalTranscriptDto {
  @ApiProperty({
    description: 'Name of the LiveKit room',
    example: 'room-123',
  })
  @IsNotEmpty()
  @IsString()
  roomName: string;
}
