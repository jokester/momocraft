import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { DiscordOAuth, GoogleOAuth } from '../../user/oauth-client.provider';
import { OAuthProvider } from '../../const/oauth-conf';

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

  isGoogle(): this is CastedOAuthAccount<GoogleOAuth.TokenSet, GoogleOAuth.UserInfo> {
    return this.provider === OAuthProvider.google;
  }
}

interface CastedOAuthAccount<Cred, UserInfo> {
  credentials: Cred;
  userInfo: UserInfo;
}
