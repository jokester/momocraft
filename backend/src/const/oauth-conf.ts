export const enum OAuthProvider {
  /**
   * @deprecated
   * @type {string}
   * FIXME: rename
   */
  googleOAuth2 = 'google',
  discord = 'discord',
}

export const OAuthAuthorizationUrl = {
  build: (base: string, clientId: string) => `${base}?client_id=${clientId}`,
  discord: 'https://discord.com/api/oauth2/authorize',
} as const;

export const SupportedOAuthProviders = [OAuthProvider.googleOAuth2, OAuthProvider.discord];
