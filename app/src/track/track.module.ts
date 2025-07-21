import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { Database } from 'sqlite3';

@Module({
  controllers: [TrackController],
  providers: [
    TrackService,
    {
      provide: Database,
      useFactory: () => new Database('chinook.sqlite'),
    },
  ],
})
export class TrackModule {}