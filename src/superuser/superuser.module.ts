import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RolesRepository } from 'src/auth/roles.repository';
import { UserTokensRepository } from 'src/auth/user-tokens.repository';
import { UserRepository } from 'src/auth/user.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { SuperuserController } from './superuser.controller';
import { SuperuserService } from './superuser.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserRepository,
      UserTokensRepository,
      RolesRepository,
      OrganizationRepository,
    ]),
  ],
  controllers: [SuperuserController],
  providers: [SuperuserService],
})
export class SuperuserModule {}
