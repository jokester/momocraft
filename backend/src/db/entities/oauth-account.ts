import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { DiscordOAuth } from '../../user/oauth-client.provider';

export const enum OAuthProvider {
  googleOAuth2 = 'googleOAuth2',
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

  constructor(init?: Omit<OAuthAccount, 'isDiscord' | 'isGoogle' | 'createdAt' | 'updatedAt' | 'oAuthAccountId'>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  isDiscord(): this is CastedOAuthAccount<DiscordOAuth.TokenSet, DiscordOAuth.UserInfo> {
    return this.provider === OAuthProvider.discord;
  }

  isGoogle(): this is CastedOAuthAccount<never, never> {
    return this.provider === OAuthProvider.googleOAuth2;
  }
}

interface CastedOAuthAccount<Cred, UserInfo> {
  credientials: Cred;
  userInfo: UserInfo;
}
