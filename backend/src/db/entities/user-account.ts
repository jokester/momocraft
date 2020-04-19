import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord';

@Entity()
export class UserAccount {
  @PrimaryGeneratedColumn()
  readonly userId!: number;

  @Column({ unique: true })
  readonly shortId!: string;

  @Column({ type: 'jsonb', default: {} })
  readonly userMeta!: InclusiveUserMeta;

  constructor(init?: Pick<UserAccount, Exclude<keyof UserAccount, 'userId'>>) {
    if (init) {
      this.shortId = init.shortId;
      this.userMeta = init.userMeta;
    }
  }
}

type InclusiveUserMeta = ReadonlyRecord<string, boolean | number | string | null>;
