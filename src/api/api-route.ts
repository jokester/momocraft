/**
 * @param {string} apiOrigin
 */
export const buildApiRoute = (apiOrigin: string) =>
  ({
    hankoUser: {
      show: (id: string) => `${apiOrigin}/user/id/${encodeURIComponent(id)}`,
      self: `/user/self`,
    },
    hankoAuth: {
      emailSignUp: `${apiOrigin}/auth/email/signup`,
      emailSignIn: `${apiOrigin}/auth/email/signin`,
      oauthGoogle: `${apiOrigin}/auth/oauth/google`,
    },

    // TODO: xxx
  } as const);
