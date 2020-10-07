import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @OneToMany(
    type => User,
    user => user.role,
    { eager: true },
  )
  users: User[];
}
