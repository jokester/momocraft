import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['fromInternalUserId', 'toInternalUserId'])
export class UserFriendRequest {
  @PrimaryGeneratedColumn()
  userFriendRequestId!: boolean;

  @Column()
  @Index()
  fromInternalUserId!: number;

  @Column()
  @Index()
  toInternalUserId!: number;

  @Column()
  approved!: boolean;

  @Column()
  comment!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  constructor(init?: Exclude<UserFriendRequest, 'userFriendRequestId'>) {
    if (init) {
      this.fromInternalUserId = init.fromInternalUserId;
      this.toInternalUserId = init.toInternalUserId;
      this.approved = init.approved;
      this.comment = init.comment;
    }
  }
}
