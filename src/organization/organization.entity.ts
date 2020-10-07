import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  website: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @OneToMany(
    type => User,
    user => user.organization,
    { eager: true },
  )
  users: User[];
}
