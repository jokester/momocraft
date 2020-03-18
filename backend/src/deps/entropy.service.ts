import { Injectable } from '@nestjs/common';
import nanoid from 'nanoid';

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
}
