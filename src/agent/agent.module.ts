import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RolesRepository } from 'src/auth/roles.repository';
import { UserTokensRepository } from 'src/auth/user-tokens.repository';
import { UserRepository } from 'src/auth/user.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

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
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
