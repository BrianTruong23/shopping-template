'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from '../cart/cart.module.css';

export default function SuccessPage() {
  useEffect(() => {
    // Clear the cart from localStorage on success
    localStorage.removeItem('cart');
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.emptyCart} style={{ padding: '120px 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✓</div>
          <h1 className={styles.emptyTitle}>Payment Successful!</h1>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1.1rem' }}>
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <Link href="/" className={styles.continueBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
