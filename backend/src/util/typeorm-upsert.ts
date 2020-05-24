import { Connection, EntitySchema, ObjectType } from 'typeorm';
import { getDebugLogger } from './get-debug-logger';
const logger = getDebugLogger(__filename);

async function upsert<E>(
  conn: Connection,
  entityTarget: ObjectType<E> | EntitySchema<E>,
  values: E[],
  onConflict: string[],
): Promise<E[]> {
  let q = conn.createQueryBuilder().insert().into(entityTarget).values(values);

  for (let i = 0; i < onConflict.length; i++) {
    q = q.onConflict(onConflict[i]);
  }

  const saved = await q.returning('*').execute();
  logger('TypeORMUtils#upsert', saved);
  return saved.raw as E[];
}

export const TypeORMUtils = {
  upsert,
} as const;
