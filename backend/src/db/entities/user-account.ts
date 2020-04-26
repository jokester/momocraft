import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserAccount {
  /**
   * internal user id
   */
  @PrimaryGeneratedColumn()
  readonly userId!: number;

  @Column({ unique: true })
  @Index({})
  readonly shortId!: string;

  @Column({ unique: true })
  readonly emailId!: string;

  @Column()
  readonly passwordHash!: string;

  @Column({ type: 'jsonb', default: {} })
  readonly userMeta: Readonly<UserMeta> = {};

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  constructor(init?: Pick<UserAccount, Exclude<keyof UserAccount, 'userId' | 'setMeta' | 'createdAt' | 'updatedAt'>>) {
    if (init) {
      this.shortId = init.shortId;
      this.emailId = init.emailId;
      this.passwordHash = init.passwordHash;
      this.userMeta = {};
      this.setMeta(init.userMeta);
    }
  }

  setMeta(other: UserMeta): this {
    const writable = this.userMeta as UserMeta;
    if (typeof other.nickName === 'string') {
      writable.nickName = other.nickName;
    }

    if (typeof other.avatarUrl === 'string') {
      writable.avatarUrl = other.avatarUrl;
    }

    return this;
  }
}

interface UserMeta {
  nickName?: string;
  avatarUrl?: string;
}
