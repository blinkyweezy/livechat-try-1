import {
  Body,
  Controller,
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
import { AdminService } from './admin.service';
import * as jwt_decode from 'jwt-decode';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //No Dto for now
  //No auth guard because it's open
  @Post()
  registerAdminWithOrganization(@Body() registration: any) {
    console.log(registration);

    return this.adminService.registerAdminWithOrganization(registration);
  }

  @Post('/invite')
  @UseGuards(AuthGuard())
  addAdminToOrganization(@Body() registration: any, @Req() request: any) {
    //[v1,v2,v3] are just for debugging purposes
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Access denied v1');
    }
    const jwtToken = request.headers.authorization;
    const { role, organization }: JwtPayload = jwt_decode(jwtToken);

    if (!role) {
      throw new UnauthorizedException('Access denied v2');
    }
    if (role !== 1) {
      throw new UnauthorizedException('Access denied v3');
    }

    return this.adminService.addAdminToOrganization(registration, organization);
  }

  @UseGuards(AuthGuard())
  @Post('/agent')
  addAgent(
    @Req() request: any,
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ) {
    //[v1,v2,v3] are just for debugging purposes
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Access denied v1');
    }
    const jwtToken = request.headers.authorization;
    const decodedPayload: JwtPayload = jwt_decode(jwtToken);

    if (!decodedPayload.role) {
      throw new UnauthorizedException('Access denied v2');
    }
    if (decodedPayload.role !== 1) {
      throw new UnauthorizedException('Access denied v3');
    }
    // return this.adminService.addAgent(authCredentialsDto);
  }

  @UseGuards(AuthGuard())
  @Get('/agent')
  getAgents(@Req() request: any) {
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Access denied v1');
    }
    const jwtToken = request.headers.authorization;
    const decodedPayload: JwtPayload = jwt_decode(jwtToken);

    if (!decodedPayload.role) {
      throw new UnauthorizedException('Access denied v2');
    }
    if (decodedPayload.role !== 1) {
      throw new UnauthorizedException('Access denied v3');
    }
    // return this.adminService.getAgents();
  }
}
