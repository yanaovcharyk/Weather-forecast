import { Module } from '@nestjs/common';
import { SortingService } from "./service/sorting.service";

@Module({
  providers: [SortingService],
  exports: [SortingService],
})
export class SortingModule {}
