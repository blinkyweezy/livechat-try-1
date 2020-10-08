import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Roles } from './roles.entity';
import { JwtPayload } from './jwt-payload.interface';
import { Organization } from 'src/organization/organization.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(
    authCredentialsDto: AuthCredentialsDto,
    role: Roles,
    organization: Organization,
  ): Promise<void> {
    console.log(authCredentialsDto);

    const { username, password, email } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    user.role = role;
    user.organization = organization;

    try {
      await user.save();
    } catch (error) {
      console.log(error);

      if (error.code === '23505') {
        // duplicate property
        throw new ConflictException('User with that email already exist');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<JwtPayload> {
    const { password, email } = authCredentialsDto;
    const user = await this.findOne(
      { email },
      { relations: ['role', 'organization'] },
    );

    console.log(user);

    if (
      user &&
      user.role &&
      user.organization &&
      (await user.validatePassword(password))
    ) {
      return {
        username: user.username,
        role: user.role.id,
        email: user.email,
        id: user.id,
        organization: user.organization.id,
      };
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
