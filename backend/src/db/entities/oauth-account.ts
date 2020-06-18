import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

export const enum OAuthProvider {
  google = 'google',
  discord = 'discord',
}

@Entity()
@Unique(['provider', 'externalId'])
export class OAuthAccount {
  @PrimaryGeneratedColumn()
  readonly oAuthAccountId!: number;

  @Column()
  readonly provider!: string;

  @Column()
  readonly userId!: number;

  @Column()
  @Index()
  readonly externalId!: string;

  @Column('json')
  readonly credentials: unknown;

  @Column('json')
  readonly userInfo: unknown;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  constructor(init?: OAuthAccount) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
