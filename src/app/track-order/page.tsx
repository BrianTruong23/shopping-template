'use client';

import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import styles from './track-order.module.css';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(false);

    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId.trim())
        .single();

      if (error) {
        throw error;
      }

      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found. Please check your Order ID and try again.');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Track Your Order</h1>
        <p className={styles.subtitle}>Enter your Order ID to see the current status.</p>

        <form onSubmit={handleTrack} className={styles.form}>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g., 123e4567-e89b...)"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {order && (
          <div className={styles.result}>
            <h2>Order Found!</h2>
            <div className={styles.orderDetails}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status || 'Processing'}</p>
              <p><strong>Total:</strong> ${order.total_price}</p>
              {/* Add more details if available in the orders table */}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
