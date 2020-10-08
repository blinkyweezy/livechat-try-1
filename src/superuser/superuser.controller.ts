import { Controller, Get, Logger } from '@nestjs/common';
import { SuperuserService } from './superuser.service';

@Controller('superuser')
export class SuperuserController {
  private logger = new Logger('SuperuserController');
  constructor(private superuserService: SuperuserService) {}

  @Get('/admin')
  async getAllAdmins() {
    return this.superuserService.getAllAdmins();
  }

  @Get('/role')
  async getAllRoles() {
    return this.superuserService.getAllRoles();
  }

  @Get('/agent')
  async getAllAgents() {
    return this.superuserService.getAllAgents();
  }

  @Get('/organization')
  async getAllOrganizations() {
    return this.superuserService.getAllOrganizations();
  }
}
