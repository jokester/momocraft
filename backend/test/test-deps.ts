import { createConnection } from 'typeorm';
import { UserAccount } from '../src/db/entities/user-account';
import { OAuthAccount } from '../src/db/entities/oauth-account';
import { EntropyService } from '../src/deps/entropy.service';

export const testDeps = {
  testConnection: createConnection({
    type: 'postgres',
    url: 'postgresql://pguser:secret@127.0.0.1:53432/hanko_test',
    synchronize: true,
    logger: 'advanced-console',
    entities: [UserAccount, OAuthAccount],
  }),
  entropy: new EntropyService(),
} as const;
