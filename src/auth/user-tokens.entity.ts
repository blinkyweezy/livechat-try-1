import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class UserTokens extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  userId: number;

  @ManyToOne(
    type => User,
    user => user.tokens,
    { eager: false },
  )
  user: User;
}
