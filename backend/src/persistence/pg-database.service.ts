import { Pool } from 'pg';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PgDatabaseService {
  private readonly pool: Pool;
  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      connectionString: configService.get<string>('POSTGRES_CONN_STRING'),
    });
  }
}
