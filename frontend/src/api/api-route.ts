/**
 * @param {string} apiOrigin
 */
export const buildApiRoute = (apiOrigin: string) =>
  ({
    momo: {
      user: {
        /**
         * GET: fetchCollections()
         * PUT: saveCollections()
         * @param {string} userId
         * @returns {string}
         */
        collection: (userId: string) => `${apiOrigin}/momo/user/${userId}/collections`,

        /**
         * GET:
         * PUT:
         * @param {string} userId
         * @returns {string}
         */
        friends: (userId: string) => `${apiOrigin}/momo/user/${userId}/friends`,

        /**
         * TODO
         * @param {string} userId
         * @returns {string}
         */
        profile: (userId: string) => `${apiOrigin}/momo/user/${userId}/profile`,
      },
    },

    hankoAuth: {
      emailSignUp: `${apiOrigin}/auth/email/signup`,
      emailSignIn: `${apiOrigin}/auth/email/signin`,
      oauthGoogle: `${apiOrigin}/auth/oauth/google`,
    },

    // TODO: xxx
  } as const);
