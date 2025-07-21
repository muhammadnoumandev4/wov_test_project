'use client';

import React, { useEffect, useState } from 'react';
import '../globals.css';  
import styles from '../page.module.css';
interface FilterBarProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  applyFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, applyFilters }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.filterBar} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <input
        type="text"
        name="genreName"
        placeholder="Genre Name"
        value={filters.genreName}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <input
        type="text"
        name="artistName"
        placeholder="Artist Name"
        value={filters.artistName}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleFilterChange}
        className={styles.input}
      />
      <button onClick={applyFilters} className={styles.button} style={{ padding: '0.5rem 1.5rem' }}>
        Apply Filters
      </button>
    </div>
  );
};

export default FilterBar;