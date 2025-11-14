import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenameTranscriptDto {
  @ApiProperty({
    description: 'New transcript name/title',
    example: 'My Custom Transcript Title',
  })
  @IsNotEmpty()
  @IsString()
  transcriptName: string;
}
