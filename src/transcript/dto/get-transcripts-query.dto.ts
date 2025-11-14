import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class GetTranscriptsQueryDto {
  @ApiProperty({
    description: 'Number of records to skip (for pagination)',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    description: 'Maximum number of records to return',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
