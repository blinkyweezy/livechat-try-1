import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { AdminModule } from './admin/admin.module';
import { AgentModule } from './agent/agent.module';
import { OrganizationModule } from './organization/organization.module';
import { SuperuserModule } from './superuser/superuser.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, TestModule, AdminModule, AgentModule, OrganizationModule, SuperuserModule],
})
export class AppModule {}
