import { Module } from '@nestjs/common';
import { Base64CursorService } from './services/base64-cursor.service';

@Module({
  providers: [
    Base64CursorService,
  ],

  exports: [
    Base64CursorService,
  ],
})
export class QueryModule {}
