import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserAccount } from './user-account';

@Entity()
@Unique(['fromUser', 'toUser'])
export class UserFriendRequest {
  @PrimaryGeneratedColumn()
  userFriendRequestId!: number;

  @OneToOne(type => UserAccount, { eager: true })
  @JoinColumn()
  @Index()
  fromUser!: UserAccount;

  @OneToOne(type => UserAccount, { eager: true })
  @JoinColumn()
  @Index()
  toUser!: UserAccount;

  @Column()
  approved!: boolean;

  @Column()
  comment!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  constructor(init?: Omit<UserFriendRequest, 'userFriendRequestId' | 'createdAt' | 'updatedAt'>) {
    if (init) {
      this.fromUser = init.fromUser;
      this.toUser = init.toUser;
      this.approved = init.approved;
      this.comment = init.comment;
    }
  }
}
