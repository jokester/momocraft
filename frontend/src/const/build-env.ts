declare const process: {
  env: {
    MOMO_API_ORIGIN: string;
    GA_TRACKING_ID: string;
    OAUTH_DISCORD_CLIENT_ID: string;
    OAUTH_GOOGLE_CLIENT_ID: string;
    // no idea why this is boolean and not string
    NEXT_DEV: boolean;
  };
};

export const inBrowser = typeof window !== 'undefined';
export const inServer = !inBrowser;

export const isDevBuild = !!process.env.NEXT_DEV;

export const buildEnv = {
  MOMO_SERVER_ORIGIN: process.env.MOMO_API_ORIGIN,
  GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  OAUTH_DISCORD_CLIENT_ID: process.env.OAUTH_DISCORD_CLIENT_ID,
  OAUTH_GOOGLE_CLIENT_ID: process.env.OAUTH_GOOGLE_CLIENT_ID,
} as const;

export type BuildEnv = typeof buildEnv;
