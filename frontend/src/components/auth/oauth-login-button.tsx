import { OAuthAuthorizationUrl } from '../../typed-routes';
import qs from 'querystring';
import { buildEnv, inBrowser } from '../../const/build-env';
import React, { useMemo } from 'react';
import { OnlyInBrowser } from '../hoc/only-in-browser';

export function buildOAuthEndpoints() {
  return {
    discord: `${OAuthAuthorizationUrl.discord}?${qs.encode({
      client_id: buildEnv.OAUTH_DISCORD_CLIENT_ID,
      response_type: 'code',
      scope: /* NOTE: 'email' does not work */ 'identify',
      redirect_uri: inBrowser ? location.origin + location.pathname : `http://localhost:3000/oauth/discord`,
      prompt: 'consent',
    })}`,
  } as const;
}

export const DiscordLoginButton: React.FC = () => {
  const urls = useMemo(buildOAuthEndpoints, []);

  return (
    <OnlyInBrowser>
      <a className="cursor-pointer h-8 border" href={urls.discord}>
        Login with Discord
      </a>
    </OnlyInBrowser>
  );
};
