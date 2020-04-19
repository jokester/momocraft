import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { GoogleOAuthResponse } from '../../user/google-oauth.service';

export enum OAuthProvider {
  googleOAuth2 = 'google-oauth2',
}

@Entity()
export class OAuthAccount {
  @PrimaryGeneratedColumn()
  readonly oAuthAccountId!: number;

  @Column()
  readonly provider!: string;

  @Column()
  readonly userId!: number;

  @Column({ unique: true })
  @Index()
  readonly externalId!: string;

  @Column('json')
  readonly credentials: unknown;

  @Column('json')
  readonly userInfo: unknown;

  constructor(init?: Pick<OAuthAccount, 'provider' | 'userId' | 'externalId' | 'credentials' | 'userInfo'>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  isGoogle(): this is GoogleOAuthResponse {
    return this.provider === OAuthProvider.googleOAuth2;
  }
}
