import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
