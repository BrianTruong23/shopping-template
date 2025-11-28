import Link from 'next/link';
import HeroCarousel from '../components/HeroCarousel';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroCarousel />

      <section className={styles.mission}>
        <div className={styles.container}>
          <h2 className={styles.missionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            At OfCourt, we believe that every player deserves professional-grade equipment. 
            We meticulously curate the finest badminton rackets from top manufacturers to ensure 
            you have the power, control, and precision to dominate the court. 
            Whether you're a power hitter or a defensive master, we have the perfect match for your style.
          </p>
          <Link href="/shop" className={styles.ctaButton}>
            Shop Rackets
          </Link>
        </div>
      </section>
    </main>
  );
}
