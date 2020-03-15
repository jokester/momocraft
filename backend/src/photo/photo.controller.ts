import { Controller, Get, Inject, Injectable } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { getDebugLogger } from '../util/get-debug-logger';

const logger = getDebugLogger(__filename);

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get('list')
  async getPhotoList() {
    const photos = await this.photoService.findAll();
    logger('list - photos', photos);
    return photos;
  }
}
