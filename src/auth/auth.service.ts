import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../schema/users.entity';
import { SupabaseService } from './supabase.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  private calculateExpiryDate(expiresIn: string): Date {
    const expiresAt = new Date();
    const match = expiresIn.match(/^(\d+)([dhms])$/);

    if (!match) {
      // Default to 7 days if format is invalid
      expiresAt.setDate(expiresAt.getDate() + 7);
      return expiresAt;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        expiresAt.setDate(expiresAt.getDate() + value);
        break;
      case 'h':
        expiresAt.setHours(expiresAt.getHours() + value);
        break;
      case 'm':
        expiresAt.setMinutes(expiresAt.getMinutes() + value);
        break;
      case 's':
        expiresAt.setSeconds(expiresAt.getSeconds() + value);
        break;
      default:
        expiresAt.setDate(expiresAt.getDate() + 7);
    }

    return expiresAt;
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { username, email, password } = signUpDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username is taken
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Sign up with Supabase
    const { error: supabaseError } = await this.supabaseService.signUp(
      email,
      password,
    );

    if (supabaseError) {
      throw new ConflictException(
        supabaseError.message || 'Failed to create user in Supabase',
      );
    }

    // Hash password for local storage
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in local database
    const user = this.userRepository.create({
      username,
      email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = {
      sub: savedUser.userId,
      email: savedUser.email,
      username: savedUser.username,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const expiresAt = this.calculateExpiryDate(expiresIn);

    const accessToken = this.jwtService.sign(payload);

    // Update user token in database
    savedUser.token = accessToken;
    await this.userRepository.save(savedUser);

    return {
      accessToken,
      expiresAt,
      user: {
        userId: savedUser.userId,
        username: savedUser.username,
        email: savedUser.email,
      },
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    // Find user in local database
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Sign in with Supabase
    const { error: supabaseError } = await this.supabaseService.signIn(
      email,
      password,
    );

    if (supabaseError) {
      throw new UnauthorizedException(
        supabaseError.message || 'Failed to authenticate with Supabase',
      );
    }

    // Generate JWT token
    const payload = {
      sub: user.userId,
      email: user.email,
      username: user.username,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const expiresAt = this.calculateExpiryDate(expiresIn);

    const accessToken = this.jwtService.sign(payload);

    // Update user token in database
    user.token = accessToken;
    await this.userRepository.save(user);

    return {
      accessToken,
      expiresAt,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      select: ['userId', 'username', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
