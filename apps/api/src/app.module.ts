import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OrchestratorController } from './orchestrator.controller';
import { CLOCK_TOKEN, SystemClock } from './kernel/clock';

@Module({
  imports: [],
  controllers: [AppController, OrchestratorController],
  providers: [
    {
      provide: CLOCK_TOKEN,
      useClass: SystemClock,
    }
  ],
})
export class AppModule {}
