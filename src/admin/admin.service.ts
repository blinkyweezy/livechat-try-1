import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { RolesRepository } from 'src/auth/roles.repository';
import { UserTokensRepository } from 'src/auth/user-tokens.repository';
import { UserRepository } from 'src/auth/user.repository';
import { OrganizationDto } from 'src/organization/dto/organization.dto';
import { Organization } from 'src/organization/organization.entity';
import { OrganizationRepository } from 'src/organization/organization.repository';

export const ADMIN_ROLE_ID = 1;

@Injectable()
export class AdminService {
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

  async getAllAdmins(organizationID: number) {
    const usersForOrganization = await this.userRepository.find({
      where: {
        organization: { id: organizationID },
        role: { id: ADMIN_ROLE_ID },
      },
    });
    usersForOrganization.forEach(user => {
      delete user.password;
      delete user.salt;
    });
    this.logger.log(usersForOrganization);
    return usersForOrganization;
  }

  async registerAdminWithOrganization(
    registration: OrganizationDto,
  ): Promise<void> {
    this.logger.verbose(registration);
    const adminRole = await this.rolesRepository.getRole(ADMIN_ROLE_ID);
    const { name, website, phone, email, username, password } = registration;
    const organization = new Organization();
    organization.email = email;
    organization.name = name;
    organization.phone = phone;
    organization.website = website;

    try {
      await organization.save();
      await this.userRepository.signUp(
        {
          email,
          organization: organization.id,
          password,
          role: adminRole.id,
          username,
        },
        adminRole,
        organization,
      );
      this.logger.verbose('Created org. and initial admin successfully.');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(JSON.stringify(error));
    }
  }

  async addAdminToOrganization(
    registration: AuthCredentialsDto,
    organizationID: number,
  ): Promise<void> {
    const adminRole = await this.rolesRepository.getRole(ADMIN_ROLE_ID);
    const { email, username, password } = registration;

    const organization = await this.organizationRepository.findOne(
      organizationID,
    );

    try {
      await this.userRepository.signUp(
        {
          email,
          organization: organization.id,
          password,
          role: adminRole.id,
          username,
        },
        adminRole,
        organization,
      );
      this.logger.verbose('invited admin to org successfully.');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(JSON.stringify(error));
    }
  }
}
