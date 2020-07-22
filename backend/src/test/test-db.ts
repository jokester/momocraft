import { Connection, createConnection } from 'typeorm';
import path from 'path';
import { getDebugLogger } from '../util/get-debug-logger';

let testConn: Promise<Connection> = null!;

const logger = getDebugLogger(__filename);

export function getTestConn(): Promise<Connection> {
  if (!testConn) {
    testConn = createConnection({
      type: 'postgres',
      url: process.env['TEST_DB_URL'] || 'postgresql://pguser:secret@127.0.0.1:54432/momo_test',
      logger: 'debug',
      synchronize: false,
      entities: [path.join(__dirname, '../db/entities/*')],
      migrations: [path.join(__dirname, '../db/migrations/*')],
      migrationsTransactionMode: 'all',
    }).then(async (c) => {
      await c.dropDatabase();
      await c.runMigrations();
      return c;
    });
  }

  return testConn;
}
