import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Database } from 'sqlite3';

@Module({
  controllers: [StatisticsController],
  providers: [
    StatisticsService,
    {
      provide: Database,
      useFactory: () => new Database('chinook.sqlite'),
    },
  ],
})
export class StatisticsModule {}
