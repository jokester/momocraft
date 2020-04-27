export class ApiClient {
  private readonly route: ReturnType<typeof buildApiRoute>;
  constructor(private readonly _fetch: typeof fetch, apiOrigin: string) {
    this.route = buildApiRoute(apiOrigin);
  }
}

/**
 * TODO: move to hanko
 * @param {string} apiOrigin
 */
const buildApiRoute = (apiOrigin: string) =>
  ({
    a: 1,
  } as const);
