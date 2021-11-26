import { ParsedUrlQuery } from 'querystring';
import { ItemsV3Json } from './items-db/json-schema';
import { OAuthProvider } from './const-shared/oauth-conf';

/**
 * a tree of statically typed route nodes (or, href-generators)
 */
export const TypedRoutes = {
  index: '/',
  items: {
    index: '/items',
    show: (item: ItemsV3Json.Item) => `/items/${item.itemId}`,
    showTemplate: `/items/[itemId]`,
  },
  friends: '/friends',
  collections: '/collections',
  about: '/about',
  account: '/account',

  posts: {
    index: '/posts',
    show: ({ postId }: { postId: number | string }) => `/posts/${postId}?timestamp=${Date.now()}`,
  },
  oauth: {
    callback: (provider: OAuthProvider) => `/oauth/${provider}`,
  },

  others: {
    contactStaff: `mailto:momo.support@jokester.io`,
  },
} as const;

export const OAuthAuthorizationUrl = {
  discord: 'https://discord.com/api/oauth2/authorize',
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
} as const;
