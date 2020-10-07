import { UserTokens } from './user-tokens.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(UserTokens)
export class UserTokensRepository extends Repository<UserTokens> {
  private logger = new Logger('UserTokensRepository');

  async assignToken(signedToken: string, user: User): Promise<void> {
    const token = new UserTokens();

    token.token = signedToken;
    token.user = user;

    try {
      await token.save();
    } catch (error) {
      this.logger.error(
        `Failed to assign token for user "${user.username}". Data: ${signedToken}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
