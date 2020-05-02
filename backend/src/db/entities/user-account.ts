import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserAccount {
  /**
   * internal user id
   * @internal
   */
  @PrimaryGeneratedColumn()
  readonly internalUserId!: number;

  @Column({ unique: true })
  @Index({})
  readonly userId!: string;

  @Column({ unique: true })
  @Index({})
  readonly emailId!: string;

  @Column()
  readonly passwordHash!: string;

  @Column({ type: 'jsonb', default: {} })
  readonly internalMeta: Readonly<object> = {};

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  constructor(
    init?: Pick<
      UserAccount,
      Exclude<keyof UserAccount, 'internalUserId' | 'setInternalMeta' | 'createdAt' | 'updatedAt'>
    >,
  ) {
    if (init) {
      this.userId = init.userId;
      this.emailId = init.emailId;
      this.passwordHash = init.passwordHash;
      this.internalMeta = {};
      this.setInternalMeta(init.internalMeta);
    }
  }

  setInternalMeta(other: unknown): this {
    if (typeof other !== 'object') {
      throw new Error('internalMeta must be object');
    }
    Object.assign(this.internalMeta, other);
    return this;
  }
}

interface UserMeta {
  nickname?: string;
  avatarUrl?: string;
}
