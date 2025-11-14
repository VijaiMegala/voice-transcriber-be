import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description:
      'JWT access token for authentication. Include this token in the Authorization header as "Bearer <token>" for protected routes.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC05MGFiLWNkZWYtMTIzNC01Njc4OTBhYmNkZWYiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    minLength: 100,
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token expiration date and time in ISO 8601 format',
    example: '2024-12-31T23:59:59.000Z',
    type: Date,
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'User information including userId, username, and email',
    type: UserResponseDto,
  })
  user: {
    userId: string;
    username: string;
    email: string;
  };
}
