import { FactoryProvider, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Issuer, Client } from 'openid-client';

export namespace GoogleOAuth {
  export const DiToken = Symbol('GoogleOAuthClient');

  type GoogleOAuthClient = Client & {
    _phantomField?: typeof DiToken;
  };

  export const Provider: FactoryProvider<Promise<Issuer<GoogleOAuthClient>>> = {
    provide: DiToken,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => Issuer.discover('https://accounts.google.com'),
  };
}

export namespace Discord {
  export const DiToken = Symbol('DiscordOAuthClient');
  type EnhancedClient = Client & {
    _phantomField?: typeof DiToken;
  };

  export const Provider: FactoryProvider<Promise<Issuer<EnhancedClient>>> = {
    provide: DiToken,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => Issuer.discover('TODO') as any,
  };
}
