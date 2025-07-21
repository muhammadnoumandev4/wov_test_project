import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('artist-track-count')
  async getArtistTrackCount(@Query('artistId') artistId: string) {
    if (!artistId || isNaN(Number(artistId))) {
      throw new BadRequestException('Invalid or missing artistId');
    }
    const numericArtistId = Number(artistId);
    const trackCount = await this.statisticsService.getArtistTrackCount(numericArtistId);
    return { artistId: numericArtistId, trackCount };
  }

  @Get('top-selling-tracks')
  async getTopSellingTracks(@Query('start') start: string, @Query('end') end: string) {
    if (!start || !end) {
      throw new BadRequestException('Both startDate and endDate are required');
    }
    try {
      const topTracks = await this.statisticsService.getTopSellingTracks(
        start,
        end,
      );
      return {
        start,
        end,
        topSellingTracks: topTracks,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}