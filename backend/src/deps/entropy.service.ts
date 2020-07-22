import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { randomString } from '@jokester/ts-commonutil/cjs/text/random-string';

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

  createUserStringId() {
    // https://zelark.github.io/nano-id-cc/
    return randomString(/* 29 chars */ 'ABCDEFGHJKLMNPRTUVWXYZ3456789', 7);
  }

  bcryptHash(pass: string): Promise<string> {
    return bcrypt.hash(pass, 10);
  }

  bcryptValidate(pass: string, hash: string): Promise<boolean> {
    return bcrypt.compare(pass, hash);
  }
}
