declare const process: {
  env: {
    MOMO_API_ORIGIN: string;
    // no idea why this is boolean and not string
    NEXT_DEV: boolean;
  };
};

export const inBrowser = typeof window === 'undefined';
export const inServer = !inBrowser;

export const isDevBuild = !!process.env.NEXT_DEV;

export const BuildEnv = {
  MOMO_SERVER_ORIGIN: process.env.MOMO_API_ORIGIN,
} as const;
