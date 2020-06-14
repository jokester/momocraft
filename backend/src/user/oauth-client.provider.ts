import { FactoryProvider, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Issuer as BaseIssuer, Client, Client as BaseClient } from 'openid-client';
import { absent } from '../util/absent';

/* eslint-disable @typescript-eslint/camelcase */
/**
 * TODO: use this after works
 */
namespace GoogleOAuth {
  export const DiToken = Symbol('GoogleOAuthClient');

  interface GoogleOAuthClient extends BaseClient {
    _phantomField?: typeof DiToken;
  }

  const Issuer = BaseIssuer.discover('https://accounts.google.com');

  export const Provider: FactoryProvider<Promise<GoogleOAuthClient>> = {
    provide: DiToken,
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
  export interface Client extends BaseClient {
    _phantomField?: typeof DiToken;
  }

  const Issuer = new BaseIssuer({
    issuer: 'Discord',
    authorization_endpoint: 'https://discord.com/api/oauth2/authorize',
    token_endpoint: 'https://discord.com/api/oauth2/token',
    revocation_endpoint: 'https://discord.com/api/oauth2/token/revoke',
  }) as BaseIssuer<Client>;

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
