import { Controller, Get, Inject } from '@nestjs/common';
import { CLOCK_TOKEN, IClock } from './kernel/clock';

@Controller()
export class AppController {
  constructor(
    @Inject(CLOCK_TOKEN) private readonly clock: IClock
  ) {}

  @Get('health')
  health() {
    return {
      status: 'online',
      version: '0.1.0',
      database: 'pending',
      uptime: Math.floor(process.uptime()),
      timestamp: this.clock.nowISO()
    };
  }
}
