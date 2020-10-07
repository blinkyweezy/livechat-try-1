import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { RolesRepository } from 'src/auth/roles.repository';
import { UserTokensRepository } from 'src/auth/user-tokens.repository';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(UserRepository)
    @InjectRepository(UserTokensRepository)
    @InjectRepository(RolesRepository)
    private userRepository: UserRepository,
    private rolesRepository: RolesRepository,
    private userTokensRepository: UserTokensRepository,
  ) {}

  async addAgent(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    //role will always be 1 anyway...
    const { role } = authCredentialsDto;
    const actualRole = await this.rolesRepository.getRole(role);

    return this.userRepository.addAgent(authCredentialsDto, actualRole);
  }
}
