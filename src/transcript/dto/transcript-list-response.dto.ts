import { ApiProperty } from '@nestjs/swagger';
import { TranscriptResponseDto } from './transcript-response.dto';

export class TranscriptListResponseDto {
  @ApiProperty({
    description: 'List of transcripts',
    type: [TranscriptResponseDto],
  })
  transcripts: TranscriptResponseDto[];

  @ApiProperty({
    description: 'Total number of transcripts',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Current offset',
    example: 0,
  })
  offset: number;

  @ApiProperty({
    description: 'Current limit',
    example: 10,
  })
  limit: number;
}
