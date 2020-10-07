import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Roles } from './roles.entity';

@EntityRepository(Roles)
export class RolesRepository extends Repository<Roles> {
  private logger = new Logger('RolesRepository');

  async getRole(id: number): Promise<Roles> {
    this.logger.verbose('Finding role id');
    return this.findOne(id);
  }
}
