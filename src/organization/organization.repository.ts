import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Organization } from './organization.entity';
import { OrganizationDto } from './dto/organization.dto';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  private logger = new Logger('OrganizationRepository');

  //   async getOrganization(id: number): Promise<Organization> {
  //     this.logger.verbose('Finding organization id');
  //     return this.findOne(id);
  //   }

  // //   async addOrganization(
  // //     organizationDto: OrganizationDto,
  // //   ): Promise<Organization> {}
}
