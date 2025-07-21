import { Injectable, Inject } from '@nestjs/common';
import { Database } from 'sqlite3';

@Injectable()
export class StatisticsService {
  constructor(@Inject(Database) private readonly db: Database) {}

   async getArtistTrackCount(artistId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT COUNT(Track.TrackId) as trackCount
         FROM Track
         INNER JOIN Album ON Track.AlbumId = Album.AlbumId
         WHERE Album.ArtistId = ?`,
        artistId,
        (error, row: { trackCount: number }) => { // <-- add type here
          if (error) reject(error);
          else resolve(row ? row.trackCount : 0);
        }
      );
    });
  }

  async getTopSellingTracks(start: string, end: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT Track.TrackId as trackId, Track.Name as name, SUM(InvoiceLine.Quantity) as totalSold
         FROM InvoiceLine
         INNER JOIN Track ON InvoiceLine.TrackId = Track.TrackId
         INNER JOIN Invoice ON InvoiceLine.InvoiceId = Invoice.InvoiceId
         WHERE Invoice.InvoiceDate BETWEEN ? AND ?
         GROUP BY Track.TrackId
         ORDER BY totalSold DESC
         LIMIT 10`,
        [start, end],
        (error, rows) => {
          if (error) reject(error);
          else resolve(rows);
        }
      );
    });
  }
}