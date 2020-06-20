import { OAuthAuthorizationUrl, TypedRoutes } from '../../typed-routes';
import qs from 'querystring';
import { buildEnv, inBrowser } from '../../const/build-env';
import React from 'react';
import { Button } from '@blueprintjs/core';
import { OAuthProvider } from '../../const-shared/oauth-conf';

export function buildOAuthEndpoints() {
  return {
    /* eslint-disable @typescript-eslint/camelcase */
    discord: `${OAuthAuthorizationUrl.discord}?${qs.encode({
      client_id: buildEnv.OAUTH_DISCORD_CLIENT_ID,
      response_type: 'code',
      scope: /* NOTE: 'email' does not work */ 'identify',
      redirect_uri:
        (inBrowser ? location.origin : 'http://localhost:3000') + TypedRoutes.oauth.callback(OAuthProvider.discord),
      prompt: 'consent',
    })}`,
    google: `${OAuthAuthorizationUrl.google}?${qs.encode({
      client_id: buildEnv.OAUTH_GOOGLE_CLIENT_ID,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
      redirect_uri:
        (inBrowser ? location.origin : 'http://localhost:3000') + TypedRoutes.oauth.callback(OAuthProvider.google),
    })}`,
    /* eslint-enable @typescript-eslint/camelcase */
  } as const;
}

export const DiscordLoginButton: React.FC = () => {
  const gotoDiscordAuth = () => {
    location.href = buildOAuthEndpoints().discord;
  };

  return <Button onClick={gotoDiscordAuth}>Login with Discord</Button>;
};

export const GoogleLoginButton: React.FC = () => {
  const gotoGoogleAuth = () => {
    location.href = buildOAuthEndpoints().discord;
  };
  return <Button onClick={gotoGoogleAuth}>Login with Google</Button>;
};
