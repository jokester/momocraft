import { Inject, Injectable } from '@nestjs/common';
import { TypeORMConnection } from '../db/typeorm-connection.provider';
import { Connection } from 'typeorm';
import { EntropyService } from '../deps/entropy.service';

@Injectable()
export class CollectionService {
  constructor(@Inject(TypeORMConnection) private conn: Connection, private entropy: EntropyService) {}
}
