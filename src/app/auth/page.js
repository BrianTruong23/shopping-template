'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - just redirect to home
    alert(isLogin ? 'Login successful!' : 'Account created successfully!');
    router.push('/');
  };

  const handleGuestCheckout = () => {
    router.push('/');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome to OfCourt</h1>
          <p className={styles.subtitle}>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>

          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${isLogin ? styles.active : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button 
              className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input 
                type="email" 
                className={styles.input}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input 
                type="password" 
                className={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className={styles.divider}>or</div>

          <button className={styles.guestBtn} onClick={handleGuestCheckout}>
            Continue as Guest
          </button>
        </div>
      </div>
    </main>
  );
}
