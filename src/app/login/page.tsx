'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('demo@ofcourt.com')
  const [password, setPassword] = useState('Demo123!')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setSuccess('Login successful! Redirecting...')
        // Short delay to show success message before redirect
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1500)
      }
    } else {
      // Sign up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            store_id: '2a066c2d-5226-4ac1-afa1-fe88a9bd31d2',
          },
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setError('')
        setSuccess('Account created successfully! Please check your email to confirm your account.')
        setMode('signin')
        setLoading(false)
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'signin' ? styles.activeTab : ''}`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.activeTab : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <h1>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
        <p className={styles.subtitle}>
          {mode === 'signin' 
            ? 'Sign in to your account' 
            : 'Sign up to start shopping'}
        </p>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className={styles.googleButton}
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <form onSubmit={handleEmailAuth} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                placeholder="John Doe"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="your@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading 
              ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') 
              : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {mode === 'signin' && (
          <p className={styles.demoInfo}>
            💡 Demo credentials are pre-filled. Just click "Sign In".
          </p>
        )}
      </div>
    </div>
  )
}
