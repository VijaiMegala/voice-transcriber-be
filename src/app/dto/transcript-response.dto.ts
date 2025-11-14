import { ApiProperty } from '@nestjs/swagger';

export class TranscriptResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Processed transcript text',
    example: 'Hello, this is a processed transcript.',
  })
  processed: string;
}
