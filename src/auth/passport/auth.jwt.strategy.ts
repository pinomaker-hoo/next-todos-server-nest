import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../application/auth.service';
import { User } from '../domain/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.accessToken || request?.headers?.accessToken;
        },
      ]),
      secretOrKey: 'swyg3',
    });
  }

  async validate(token): Promise<User> {
    return await this.authService.getUserByIdx(token.idx);
  }
}
