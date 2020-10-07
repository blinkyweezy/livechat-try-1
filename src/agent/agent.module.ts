import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRepository } from 'src/auth/roles.repository';
import { UserTokensRepository } from 'src/auth/user-tokens.repository';
import { UserRepository } from 'src/auth/user.repository';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserTokensRepository,
      RolesRepository,
    ]),
  ],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
