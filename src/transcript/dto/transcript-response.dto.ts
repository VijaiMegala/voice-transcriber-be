import { ApiProperty } from '@nestjs/swagger';

export class TranscriptResponseDto {
  @ApiProperty({
    description: 'Transcript ID',
    example: 1,
  })
  transcriptId: number;

  @ApiProperty({
    description: 'Transcript name/title',
    example: 'This is a sample',
  })
  transcriptName: string;

  @ApiProperty({
    description: 'Transcript text content',
    example: 'This is a sample transcript text.',
  })
  transcript: string | null;

  @ApiProperty({
    description: 'User ID who owns the transcript',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Date when the transcript was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the transcript was last updated',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
