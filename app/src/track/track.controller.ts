import { Controller, Get, Param, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { TrackService } from './track.service';
import { GetTracksQueryDto } from './get-tracks-query.dto';
import { TrackResponseDto } from './track-response.dto';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get(':id')
  async getTrackById(@Param('id') id: string): Promise<TrackResponseDto> {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('Invalid or missing trackId');
    }
    const numericId = Number(id);
    const track = await this.trackService.getTrackById(numericId);
    if (!track) throw new NotFoundException('Track not found');
    return {
      id: track.TrackId,
      name: track.Name,
      price: track.UnitPrice,
      duration: track.Milliseconds / 1000,
      genre: track.GenreName,
    };
  }

  @Get()
  async getTracks(@Query() query: GetTracksQueryDto): Promise<TrackResponseDto[]> {
    const tracks = await this.trackService.getTracks(query);
    return tracks.map(track => ({
      id: track.TrackId,
      name: track.Name,
      price: track.UnitPrice,
      duration: track.Milliseconds / 1000,
      genre: track.GenreName,
    }));
  }
}