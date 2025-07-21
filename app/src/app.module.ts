import { Module } from '@nestjs/common';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [AlbumModule,TrackModule],
})
export class AppModule {}
