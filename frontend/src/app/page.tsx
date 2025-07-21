'use client';

import React, { useEffect, useState } from 'react';
import './globals.css';  
import FilterBar from './component/filter';

interface Track {
  id: number;
  name: string;
  price: number;
  duration: number;
  genre: string;
}

const PAGE_SIZE = 10;



export default function Page() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    genreName: '',
    artistName: '',
    minPrice: '',
    maxPrice: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
const fetchTracks = async (pageNum: number, filterVals = appliedFilters) => {
  setLoading(true);
  try {

    const params = new URLSearchParams({
      page: pageNum.toString(),
      pageSize: PAGE_SIZE.toString(),
    });
    
  
    if (filterVals.genreName) params.append('genreName', filterVals.genreName);
    if (filterVals.artistName) params.append('artistName', filterVals.artistName);
    if (filterVals.minPrice) params.append('minPrice', filterVals.minPrice);
    if (filterVals.maxPrice) params.append('maxPrice', filterVals.maxPrice);


    const res = await fetch(`http://localhost:3001/tracks?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch tracks');
    }
    const data: Track[] = await res.json();
    setTracks(data);
    setHasMore(data.length === PAGE_SIZE); 
  } catch (err) {
    console.error("Error fetching tracks:", err);
    setHasMore(false);
  }
  setLoading(false);
};

  useEffect(() => {
    fetchTracks(page);
  }, [page, appliedFilters]);

  const applyFilters = () => {
    setAppliedFilters(filters); 
    setPage(0);
  };

  return (
    <main className="main-container">
      <h1 className="heading">Top Tracks</h1>
      <FilterBar filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
      <div className="track-list">
        {tracks.map(track => (
          <div key={track.id} className="track-card">
            <h2 className="track-name">{track.name}</h2>
            <p className="track-details">
              <span><strong>Genre:</strong> {track.genre}</span>
              <span><strong>Price:</strong> ${track.price}</span>
              <span><strong>Duration:</strong> {track.duration}s</span>
            </p>
          </div>
        ))}
      </div>
      <div className="pagination-buttons">
        <button
          className="page-btn"
          onClick={() => setPage(page - 1)}
          disabled={page === 0 || loading}
        >
          Previous
        </button>
        <button
          className="page-btn"
          onClick={() => setPage(page + 1)}
          disabled={!hasMore || loading}
        >
          Next
        </button>
      </div>
      {loading && <p className="loading-text">Loading...</p>}
      {!hasMore && <p className="no-more-text">No more tracks available!</p>}
    </main>
  );
};
