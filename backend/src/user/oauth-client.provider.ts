import { FactoryProvider, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OpenIdClient from 'openid-client';
import { absent } from '../util/absent';

interface OAuthExternalIdentity<T extends OpenIdClient.TokenSet, U> {
  tokenSet: T;
  userInfo: U;
}

/* eslint-disable @typescript-eslint/camelcase */
/**
 * TODO: use this after works
 */
namespace GoogleOAuth {
  export const DiToken = Symbol('GoogleOAuthClient');

  interface GoogleOAuthClient extends OpenIdClient.Client {
    _phantomField?: typeof DiToken;
  }

  const Issuer = OpenIdClient.Issuer.discover('https://accounts.google.com');

  export const Provider: FactoryProvider<Promise<GoogleOAuthClient>> = {
    provide: DiToken,
    scope: Scope.DEFAULT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      Issuer.then(
        (issuer) =>
          new issuer.Client({
            client_id: configService.get('OAUTH_GOOGLE_CLIENT_ID') || absent('$OAUTH_GOOGLE_CLIENT_ID'),
            client_secret: configService.get('OAUTH_GOOGLE_CLIENT_SECRET') || absent('$OAUTH_GOOGLE_CLIENT_SECRET'),
          }),
      ),
  };
}

export namespace DiscordOAuth {
  export const DiToken = Symbol('DiscordOAuthClient');
  export interface Client extends OpenIdClient.Client {
    _phantomField?: typeof DiToken;
  }

  export interface TokenSet extends OpenIdClient.TokenSet {}

  /**
   * @see https://discord.com/developers/docs/resources/user#user-object
   */
  export interface UserInfo extends OpenIdClient.UserinfoResponse {
    sub: never;
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    email: string;
    verified: boolean;
    locale: string;
    mfa_enabled: boolean;
  }
  export interface Authed extends OAuthExternalIdentity<TokenSet, UserInfo> {}

  const Issuer = new OpenIdClient.Issuer({
    issuer: 'Discord',
    authorization_endpoint: 'https://discord.com/api/oauth2/authorize',
    token_endpoint: 'https://discord.com/api/oauth2/token',
    revocation_endpoint: 'https://discord.com/api/oauth2/token/revoke',
    userinfo_endpoint: 'https://discord.com/api/v6/users/@me',
  }) as OpenIdClient.Issuer<Client>;

  export const Provider: FactoryProvider<Client> = {
    provide: DiToken,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      new Issuer.Client({
        client_id: configService.get('OAUTH_DISCORD_CLIENT_ID') || absent('$OAUTH_DISCORD_CLIENT_ID'),
        client_secret: configService.get('OAUTH_DISCORD_CLIENT_SECRET') || absent('$OAUTH_DISCORD_CLIENT_SECRET'),
      }),
  };
}
