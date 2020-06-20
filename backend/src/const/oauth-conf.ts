export const enum OAuthProvider {
  /**
   * @deprecated
   * @type {string}
   * FIXME: rename
   */
  googleOAuth2 = 'google',
  discord = 'discord',
}

export const SupportedOAuthProviders = [OAuthProvider.googleOAuth2, OAuthProvider.discord];
