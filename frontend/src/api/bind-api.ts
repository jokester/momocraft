import { Configuration, DefaultApi } from '../api-generated';
import { buildEnv, inBrowser } from '../const/build-env';
import { Never } from '@jokester/ts-commonutil/concurrency/timing';

export interface ApiProvider {
  (headers?: Record<string, string>): DefaultApi;
}

const boundFetch: typeof fetch = inBrowser ? fetch.bind(window) : () => Never;

export const bindApi: ApiProvider = (headers) =>
  new DefaultApi(
    new Configuration({
      fetchApi: boundFetch,
      basePath: buildEnv.MOMO_SERVER_ORIGIN,
      headers,
    }),
  );
