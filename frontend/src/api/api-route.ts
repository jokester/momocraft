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
         * GET: get own friends
         * PUT: send / approve user request
         * @param {string} userId
         * @returns {string}
         */
        friends: (userId: string) => `${apiOrigin}/momo/user/${userId}/friends`,

        /**
         * GET: get mutual friends / collections
         * @param {string} userId
         * @returns {string}
         */
        friendCollections: (userId: string) => `${apiOrigin}/momo/user/${userId}/friendCollections`,

        /**
         * TODO
         * @param {string} userId
         * @returns {string}
         */
        profile: (userId: string) => `${apiOrigin}/momo/user/${userId}/profile`,
      },
      resolve: {
        friendCollections: (userId: string) => `${apiOrigin}/resolve/user/${userId}/friendCollections`,
      },
    },

    hankoAuth: {
      emailSignUp: `${apiOrigin}/auth/email/signup`,
      emailSignIn: `${apiOrigin}/auth/email/signin`,
      oauthGoogle: `${apiOrigin}/auth/oauth/google`,
      refreshToken: `${apiOrigin}/auth/jwt/refresh`,
    },

    // TODO: xxx
  } as const);
