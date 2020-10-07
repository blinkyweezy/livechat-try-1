import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserTokens } from './user-tokens.entity';
import { Roles } from './roles.entity';
import { Organization } from 'src/organization/organization.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToOne(role => Roles)
  @JoinColumn()
  role: Roles;

  @OneToOne(organization => Organization)
  @JoinColumn()
  organization: Organization;

  @OneToMany(
    type => UserTokens,
    token => token.user,
    { eager: true },
  )
  tokens: UserTokens[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
