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

  //Not being used atm
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { role } = authCredentialsDto;
    const actualRole = await this.rolesRepository.getRole(role);
    console.log(actualRole);

    // return this.userRepository.signUp(authCredentialsDto, actualRole);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = user;
    const accessToken = await this.jwtService.signAsync(payload);

    await this.userTokensRepository.assignToken(
      accessToken,
      await this.userRepository.findOne({ username: user.username }),
    );

    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(
        payload,
      )} and access token pushed`,
    );
    return { accessToken };
  }

  // async signOut(authCredentialsDto: AuthCredentialsDto): Promise<void> {
  //   this.userRepository.de
  // }
}
