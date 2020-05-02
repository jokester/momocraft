import { ParsedUrlQuery } from 'querystring';
import { ItemsV3Json } from './items-db/json-schema';

/**
 * a tree of statically typed route nodes (or, href-generators)
 */
export const TypedRoutes = {
  index: '/',
  items: {
    index: '/items',
    show: (itemId: string) => `/items/${itemId}`,
    show2: (item: ItemsV3Json.Item) => `/items/${item.itemId}`,
  },
  friends: '/friends',
  about: '/about',
  account: '/account',

  posts: {
    index: '/posts',
    show: ({ postId }: { postId: number | string }) => `/posts/${postId}?timestamp=${Date.now()}`,
  },
} as const;

/**
 * extract route (in URL path) param if there is one
 */
export type TypedRouteParam<RouteNode> = RouteNode extends (param: infer Param) => string ? Param & ParsedUrlQuery : {};
