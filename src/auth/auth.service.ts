import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserTokensRepository } from './user-tokens.repository';
import { RolesRepository } from './roles.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    @InjectRepository(UserTokensRepository)
    @InjectRepository(RolesRepository)
    private userRepository: UserRepository,
    private rolesRepository: RolesRepository,
    private userTokensRepository: UserTokensRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const userTokenPayload = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!userTokenPayload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = userTokenPayload;
    const accessToken = await this.jwtService.signAsync(payload);

    await this.userTokensRepository.assignToken(
      accessToken,
      await this.userRepository.findOne({
        email: userTokenPayload.email,
      }),
    );

    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(
        payload,
      )} and access token pushed`,
    );
    return { accessToken };
  }
}
