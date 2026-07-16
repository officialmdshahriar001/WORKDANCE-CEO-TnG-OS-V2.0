import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CLOCK_TOKEN, SystemClock } from './kernel/clock';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: CLOCK_TOKEN,
      useClass: SystemClock,
    }
  ],
})
export class AppModule {}
