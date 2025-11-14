import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTranscriptDto {
  @ApiProperty({
    description: 'Transcript text content',
    example: 'This is an updated transcript text.',
    required: false,
  })
  @IsOptional()
  @IsString()
  transcript?: string;

  @ApiProperty({
    description: 'Transcript name/title',
    example: 'Updated Transcript Title',
    required: false,
  })
  @IsOptional()
  @IsString()
  transcriptName?: string;
}
