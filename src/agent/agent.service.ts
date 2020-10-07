import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { RolesRepository } from 'src/auth/roles.repository';
import { UserTokensRepository } from 'src/auth/user-tokens.repository';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { Organization } from 'src/organization/organization.entity';
import { OrganizationRepository } from 'src/organization/organization.repository';

export const AGENT_ROLE_ID = 2;

@Injectable()
export class AgentService {
  private logger = new Logger('AdminService');
  constructor(
    @InjectRepository(UserRepository)
    @InjectRepository(UserTokensRepository)
    @InjectRepository(RolesRepository)
    @InjectRepository(OrganizationRepository)
    private userRepository: UserRepository,
    private rolesRepository: RolesRepository,
    private userTokensRepository: UserTokensRepository,
    private organizationRepository: OrganizationRepository,
  ) {}

  async getAllAgents(organizationID: number) {
    const usersForOrganization = await this.userRepository.find({
      where: {
        organization: { id: organizationID },
        role: { id: AGENT_ROLE_ID },
      },
    });
    usersForOrganization.forEach(user => {
      delete user.password;
      delete user.salt;
    });
    this.logger.log(usersForOrganization);
    return usersForOrganization;
  }

  async addAgentToOrganization(
    registration: AuthCredentialsDto,
    organizationID: number,
  ): Promise<void> {
    const actualRole = await this.rolesRepository.getRole(AGENT_ROLE_ID);
    const organization = await this.organizationRepository.findOne(
      organizationID,
    );

    return this.userRepository.signUp(registration, actualRole, organization);
  }

  async promoteAgent(id: number, role: number) {
    const agent = await this.userRepository.findOne(id, {
      relations: ['role'],
    });
    if (!agent) {
      this.logger.error('Agent not found');
      throw new NotFoundException('Agent With That ID not found,');
    }
    const newRole = await this.rolesRepository.findOne(role);

    if (!newRole) {
      this.logger.error('Role not found');
      throw new NotFoundException('Role not found');
    }

    if (agent.role.id !== AGENT_ROLE_ID) {
      this.logger.error("Trying to assign role to agent who isn't an agent??");
      throw new ConflictException('This user is not an agent');
    }

    if (newRole === agent.role) {
      this.logger.error('Trying to assign agent to same role :\\');
      throw new ConflictException('Trying to assign agent to same role :/');
    }

    agent.role = newRole;

    await agent.save();

    this.logger.verbose('Agent promoted to role successfully');
  }
}
