import Link from 'next/link';
import styles from './ListingCard.module.css';

export default function ListingCard({ listing }) {
  return (
    <div className={styles.card}>
      <div 
        className={styles.imagePlaceholder} 
        style={{ backgroundColor: listing.color }}
      >
        <span className={styles.placeholderText}>Racket Image Placeholder</span>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.series}>{listing.series}</span>
          <h3 className={styles.title}>{listing.title}</h3>
        </div>
        <div className={styles.specs}>
          <span>{listing.specs.weight}</span>
          <span>•</span>
          <span>{listing.specs.balance}</span>
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>{listing.price}</span>
          <Link href={`/customize/${listing.id}`} className={styles.viewButton}>
            Customize
          </Link>
        </div>
      </div>
    </div>
  );
}
