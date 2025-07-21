import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class GetTracksQueryDto {
  @IsOptional()
  @IsString()
  artistName?: string;

  @IsOptional()
  @IsString()
  genreName?: string;
 
  @IsOptional()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  page: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}