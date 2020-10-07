import {
  Body,
  Controller,
  Logger,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { AdminService, ADMIN_ROLE_ID } from './admin.service';
import * as jwt_decode from 'jwt-decode';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { OrganizationDto } from 'src/organization/dto/organization.dto';

@Controller('admin')
export class AdminController {
  private logger = new Logger('AdminController');
  constructor(private adminService: AdminService) {}

  @Get()
  @UseGuards(AuthGuard())
  getAllAdmins(@Req() request: any) {
    //[v1,v2,v3] are just for debugging purposes
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Access denied v1');
    }
    const jwtToken = request.headers.authorization;
    const { role, organization }: JwtPayload = jwt_decode(jwtToken);

    if (!role) {
      throw new UnauthorizedException('Access denied v2');
    }

    if (role !== ADMIN_ROLE_ID) {
      throw new UnauthorizedException('Access denied v3');
    }

    return this.adminService.getAllAdmins(organization);
  }

  @Post()
  registerAdminWithOrganization(
    @Body(ValidationPipe) registration: OrganizationDto,
  ) {
    this.logger.debug(registration);

    return this.adminService.registerAdminWithOrganization(registration);
  }

  @Post('/invite')
  @UseGuards(AuthGuard())
  addAdminToOrganization(
    @Body(ValidationPipe) registration: AuthCredentialsDto,
    @Req() request: any,
  ) {
    //[v1,v2,v3] are just for debugging purposes
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Access denied v1');
    }
    const jwtToken = request.headers.authorization;
    const { role, organization }: JwtPayload = jwt_decode(jwtToken);

    if (!role) {
      throw new UnauthorizedException('Access denied v2');
    }
    if (role !== ADMIN_ROLE_ID) {
      throw new UnauthorizedException('Access denied v3');
    }

    return this.adminService.addAdminToOrganization(registration, organization);
  }
}
