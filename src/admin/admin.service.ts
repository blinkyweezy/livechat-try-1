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
import { Organization } from 'src/organization/organization.entity';
import { OrganizationRepository } from 'src/organization/organization.repository';

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

  //No dto for now

  async registerAdminWithOrganization(registration: any) {
    console.log(registration);
    const adminRole = await this.rolesRepository.getRole(1);
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
      console.log('Created org and initial admin successfully.');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async addAdminToOrganization(registration: any, organizationID: number) {
    const adminRole = await this.rolesRepository.getRole(1);
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
      console.log('invited admin to org successfully.');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
