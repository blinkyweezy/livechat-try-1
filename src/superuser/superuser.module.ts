import { Module } from '@nestjs/common';
import { SuperuserController } from './superuser.controller';
import { SuperuserService } from './superuser.service';

@Module({
  controllers: [SuperuserController],
  providers: [SuperuserService]
})
export class SuperuserModule {}
