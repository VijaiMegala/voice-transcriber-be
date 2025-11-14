import { ApiProperty } from '@nestjs/swagger';

export class DictionaryResponseDto {
  @ApiProperty({
    description: 'Dictionary entry ID',
    example: 1,
  })
  wordId: number;

  @ApiProperty({
    description: 'Current word to be replaced',
    example: 'colour',
  })
  currentWord: string;

  @ApiProperty({
    description: 'Replacement word',
    example: 'color',
  })
  replacementWord: string;

  @ApiProperty({
    description: 'User ID who owns this dictionary entry',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
