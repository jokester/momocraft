import { ParsedUrlQuery } from 'querystring';
import { ItemsV2Json } from './json/json';

/**
 * a tree of statically typed route nodes (or, href-generators)
 */
export const TypedRoutes = {
  index: '/',
  items: {
    index: '/items',
    show: (itemId: string) => `/items/${itemId}`,
    show2: (item: ItemsV2Json.Item) => `/items/${item.itemName}`,
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
