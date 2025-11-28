import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Contact Us</h3>
            <div className={styles.contactInfo}>
              <a href="mailto:support@ofcourt.com" className={styles.contactItem}>
                <span className={styles.icon}>📧</span>
                <span>support@ofcourt.com</span>
              </a>
              <a href="tel:+1-555-0123" className={styles.contactItem}>
                <span className={styles.icon}>📞</span>
                <span>(555) 012-3456</span>
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h3>My Account</h3>
            <div className={styles.links}>
              <Link href="/login" className={styles.link}>Sign In</Link>
              <Link href="/login" className={styles.link}>Create Account</Link>
              <Link href="/orders" className={styles.link}>Order History</Link>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Customer Service</h3>
            <div className={styles.links}>
              <Link href="/track-order" className={styles.link}>Track Order</Link>
              <Link href="/shipping" className={styles.link}>Shipping Info</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2025 OfCourt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
