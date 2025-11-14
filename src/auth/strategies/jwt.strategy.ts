import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../schema/users.entity';

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

export interface RequestUser {
  userId: string;
  email: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.userRepository.findOne({
      where: { userId: payload.sub },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found or deleted');
    }

    return {
      userId: user.userId,
      email: user.email,
      username: user.username,
    };
  }
}
