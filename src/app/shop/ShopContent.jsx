'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { listings } from '../data';
import ListingCard from '../../components/ListingCard';
import styles from './shop.module.css';

export default function ShopContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Get unique brands
  const brands = ['all', ...new Set(listings.map(l => l.brand))];

  // Filter listings based on search query AND brand
  const filteredListings = listings.filter((listing) => {
    const matchesSearch = !query || 
      listing.title.toLowerCase().includes(query.toLowerCase()) ||
      listing.series.toLowerCase().includes(query.toLowerCase()) ||
      listing.description.toLowerCase().includes(query.toLowerCase());
    
    const matchesBrand = selectedBrand === 'all' || listing.brand === selectedBrand;
    
    return matchesSearch && matchesBrand;
  });

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
          <h1 className={styles.title}>
            {query ? `Search Results for "${query}"` : 'Our Racket Collection'}
          </h1>
          {query && (
            <p className={styles.subtitle}>
              Found {filteredListings.length} {filteredListings.length === 1 ? 'racket' : 'rackets'}
            </p>
          )}
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.filterBar}>
          <label htmlFor="brand-filter" className={styles.filterLabel}>
            Filter by Brand:
          </label>
          <select
            id="brand-filter"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={styles.filterSelect}
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand === 'all' ? 'All Brands' : brand}
              </option>
            ))}
          </select>
          <span className={styles.resultCount}>
            Showing {filteredListings.length} {filteredListings.length === 1 ? 'racket' : 'rackets'}
          </span>
        </div>

        {filteredListings.length > 0 ? (
          <div className={styles.grid}>
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h2>No rackets found</h2>
            <p>Try adjusting your search terms or brand filter, or <Link href="/shop">browse all rackets</Link></p>
          </div>
        )}
      </div>
    </main>
  );
}
