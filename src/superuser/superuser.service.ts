import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ADMIN_ROLE_ID } from 'src/admin/admin.service';
import { AGENT_ROLE_ID } from 'src/agent/agent.service';
import { Roles } from 'src/auth/roles.entity';
import { RolesRepository } from 'src/auth/roles.repository';
import { UserTokensRepository } from 'src/auth/user-tokens.repository';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { Organization } from 'src/organization/organization.entity';
import { OrganizationRepository } from 'src/organization/organization.repository';

@Injectable()
export class SuperuserService {
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

  async getAllAdmins(): Promise<User[]> {
    return this.userRepository.find({ where: { role: { id: ADMIN_ROLE_ID } } });
  }

  async getAllRoles(): Promise<Roles[]> {
    return this.rolesRepository.find();
  }

  async getAllAgents(): Promise<User[]> {
    return this.userRepository.find({ where: { role: { id: AGENT_ROLE_ID } } });
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }
}
