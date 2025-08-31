import { Module } from '@nestjs/common';
import { AppUrlService } from './app-url.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppUrlService],
  exports: [AppUrlService],
})
export class AppUrlModule {}
