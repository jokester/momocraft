import { OAuthAuthorizationUrl } from '../../typed-routes';
import qs from 'querystring';
import { buildEnv, inBrowser } from '../../const/build-env';
import React from 'react';
import { Button } from '@blueprintjs/core';

export function buildOAuthEndpoints() {
  return {
    discord: `${OAuthAuthorizationUrl.discord}?${qs.encode({
      client_id: buildEnv.OAUTH_DISCORD_CLIENT_ID,
      response_type: 'code',
      scope: /* NOTE: 'email' does not work */ 'identify',
      redirect_uri: (inBrowser ? location.origin : 'http://localhost:3000') + `/oauth/discord`,
      prompt: 'consent',
    })}`,
  } as const;
}

export const DiscordLoginButton: React.FC = () => {
  const gotoDiscordAuth = () => {
    location.href = buildOAuthEndpoints().discord;
  };

  return <Button onClick={gotoDiscordAuth}>Login with Discord</Button>;
};
