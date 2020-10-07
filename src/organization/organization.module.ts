import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRepository } from 'src/auth/roles.repository';
import { UserTokensRepository } from 'src/auth/user-tokens.repository';
import { UserRepository } from 'src/auth/user.repository';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './organization.repository';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserTokensRepository,
      RolesRepository,
      OrganizationRepository,
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
