import { Inject, Injectable } from '@nestjs/common';
import { Photo } from '../db/entities/photo';
import { Connection } from 'typeorm';
import { TypeORMConnection } from '../db/typeorm-connection.provider';

@Injectable()
export class PhotoService {
  constructor(@Inject(TypeORMConnection) private conn: Connection) {}

  async findAll(): Promise<Photo[]> {
    const repo = this.conn.getRepository(Photo);
    return repo.find();
  }

  async create() {}
}
