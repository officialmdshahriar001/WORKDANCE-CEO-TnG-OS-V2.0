export const CLOCK_TOKEN = Symbol('IClock');

export interface IClock {
  nowISO(): string;
  now(): Date;
}

export class SystemClock implements IClock {
  nowISO(): string {
    return new Date().toISOString();
  }
  
  now(): Date {
    return new Date();
  }
}
