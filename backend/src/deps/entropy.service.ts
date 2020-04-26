import { Injectable } from '@nestjs/common';
import nanoid from 'nanoid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EntropyService {
  now(): number {
    return Date.now();
  }

  nowAsTimestamp(): Date {
    return new Date();
  }

  createNanoId(): string {
    return nanoid(9);
  }

  bcryptHash(pass: string): Promise<string> {
    return bcrypt.hash(pass, 10);
  }
}
