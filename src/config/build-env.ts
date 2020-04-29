declare const process: {
  env: {
    MOMO_API_ORIGIN: string;
    // no idea why this is boolean and not string
    GA_TRACKING_ID: string;
    NEXT_DEV: boolean;
  };
};

export const inBrowser = typeof window !== 'undefined';
export const inServer = !inBrowser;

export const isDevBuild = !!process.env.NEXT_DEV;

export const buildEnv = {
  MOMO_SERVER_ORIGIN: process.env.MOMO_API_ORIGIN,
  GA_TRACKING_ID: process.env.GA_TRACKING_ID,
} as const;

export type BuildEnv = typeof buildEnv;
