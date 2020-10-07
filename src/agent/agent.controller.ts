import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt_decode from 'jwt-decode';
import { ADMIN_ROLE_ID } from 'src/admin/admin.service';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { User } from 'src/auth/user.entity';
import { AgentService } from './agent.service';

@Controller('agent')
@UseGuards(AuthGuard())
export class AgentController {
  private logger = new Logger('AgentController');
  constructor(private agentService: AgentService) {}

  @Get()
  getAllAgents(@Req() request: any) {
    //[v1,v2,v3] are just for debugging purposes
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Access denied v1');
    }
    const jwtToken = request.headers.authorization;
    const { role, organization }: JwtPayload = jwt_decode(jwtToken);

    if (!role) {
      throw new UnauthorizedException('Access denied v2');
    }

    return this.agentService.getAllAgents(organization);
  }

  @Post('/invite')
  addAgentToOrganization(
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

    return this.agentService.addAgentToOrganization(registration, organization);
  }

  @Patch('/:id/promote')
  promoteAgentToAdmin(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: number,
  ) {
    //[v1,v2,v3] are just for debugging purposes
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Access denied v1');
    }
    const jwtToken = request.headers.authorization;
    const { role: requestingRole }: JwtPayload = jwt_decode(jwtToken);

    if (!requestingRole) {
      throw new UnauthorizedException('Access denied v2');
    }
    if (requestingRole !== ADMIN_ROLE_ID) {
      throw new UnauthorizedException('Access denied v3');
    }

    //Admin ${adminId} promoting agent ${agentId} to new ${role} on ${date}
    return this.agentService.promoteAgent(id, role);
  }
}
