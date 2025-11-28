'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import styles from './account.module.css';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
    router.refresh();
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>Loading account information...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0];

  const initial = displayName ? displayName[0].toUpperCase() : 'U';

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" />
              ) : (
                initial
              )}
            </div>
            <h1 className={styles.title}>{displayName}</h1>
            <p className={styles.subtitle}>
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Account Details</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email Address</span>
                  <span className={styles.value}>{user.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>User ID</span>
                  <span
                    className={styles.value}
                    style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                  >
                    {user.id}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Link
                href="/orders"
                className={`${styles.button} ${styles.primaryButton}`}
              >
                View Order History
              </Link>
              <button
                onClick={handleLogout}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
