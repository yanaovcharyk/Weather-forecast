import { Module } from '@nestjs/common';
import { CursorPaginationService } from './services/cursor-pagination.service';
import { Base64CursorEncoder } from './cursor/base64-cursor.encoder';

@Module({
  providers: [
    CursorPaginationService,
    Base64CursorEncoder,
  ],
  exports: [
    CursorPaginationService,
    Base64CursorEncoder,
    ],
  })
export class PaginationModule {}