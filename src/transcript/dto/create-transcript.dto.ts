import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTranscriptDto {
  @ApiProperty({
    description: 'Transcript text content',
    example:
      'This is a sample transcript text that will be used to create a new transcript entry.',
  })
  @IsNotEmpty()
  @IsString()
  transcript: string;
}
