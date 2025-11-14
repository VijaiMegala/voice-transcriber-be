import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the user (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe',
    minLength: 3,
    maxLength: 100,
  })
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    format: 'email',
    maxLength: 255,
  })
  email: string;

  @ApiProperty({
    description: 'Date and time when the user account was created',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the user account was last updated',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  updatedAt: Date;
}
