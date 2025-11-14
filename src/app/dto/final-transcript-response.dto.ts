import { ApiProperty } from '@nestjs/swagger';

export class FinalTranscriptResponseDto {
  @ApiProperty({
    description: 'Final processed transcript text',
    example: 'This is the final processed transcript of the conversation.',
  })
  transcript: string;
}
