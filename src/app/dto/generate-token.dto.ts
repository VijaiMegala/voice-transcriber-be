import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
}
