import { Injectable, Inject } from '@nestjs/common';
import { Database } from 'sqlite3';
import { GetTracksQueryDto } from './get-tracks-query.dto';

export interface GetTrackData {
  TrackId: number;
  Name: string;
  UnitPrice: number;
  Milliseconds: number;
  GenreName: string;
}

@Injectable()
export class TrackService {
  constructor(@Inject(Database) private readonly db: Database) {}

  async getTrackById(id: number): Promise<GetTrackData | undefined> {
    return new Promise<GetTrackData | undefined>((resolve, reject) => {
      this.db.get(
        `SELECT Track.TrackId, Track.Name, Track.UnitPrice, Track.Milliseconds, Genre.Name as GenreName
         FROM Track
         LEFT JOIN Genre ON Track.GenreId = Genre.GenreId
         WHERE Track.TrackId = ?`,
        id,
        (error, data: GetTrackData) => {
          if (error) {
            console.error('Database error in getTrackById:', error);
            reject(new Error('Failed to retrieve track'));
          } else {
            resolve(data);
          }
        },
      );
    });
  }

  async getTracks(query: GetTracksQueryDto): Promise<GetTrackData[]> {
    // Ensure all numeric query params are numbers
    const artistName = query.artistName;
    const genreName = query.genreName;
    const minPrice = query.minPrice;
    const maxPrice = query.maxPrice;
    const page = query.page;
    const pageSize = query.pageSize;

    let queryString = `
      SELECT Track.TrackId, Track.Name, Track.UnitPrice, Track.Milliseconds, Genre.Name as GenreName
      FROM Track
      LEFT JOIN Genre ON Track.GenreId = Genre.GenreId
      LEFT JOIN Album ON Track.AlbumId = Album.AlbumId
      LEFT JOIN Artist ON Album.ArtistId = Artist.ArtistId
      WHERE 1=1
    `;
    const params: any[] = [];

    if (artistName) {
      queryString += ' AND Artist.Name LIKE ?';
      params.push(`%${artistName}%`);
    }
    if (genreName) {
      queryString += ' AND Genre.Name = ?';
      params.push(genreName);
    }
    if (minPrice !== undefined) {
      queryString += ' AND Track.UnitPrice >= ?';
      params.push(minPrice);
    }
    if (maxPrice !== undefined) {
      queryString += ' AND Track.UnitPrice < ?';
      params.push(maxPrice);
    }
    queryString += ' LIMIT ? OFFSET ?';
    params.push(pageSize, page * pageSize);

    return new Promise<GetTrackData[]>((resolve, reject) => {
      this.db.all(queryString, params, (error, data: GetTrackData[]) => {
        if (error) {
          console.error('Database error in getTracks:', error);
          reject(new Error('Failed to retrieve tracks'));
        } else {
          resolve(data);
        }
      });
    });
  }
}