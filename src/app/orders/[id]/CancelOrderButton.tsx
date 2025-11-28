'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteOrder } from '../../actions/orderActions';
import styles from './orderDetails.module.css';

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteOrder(orderId);

      if (result.success) {
        alert('Order cancelled successfully.');
        router.push('/orders');
        router.refresh();
      } else {
        alert(result.message || 'Failed to cancel order.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('An unexpected error occurred.');
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleCancel} 
      disabled={isDeleting}
      className={styles.cancelButton}
      style={{
        padding: '12px 24px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        opacity: isDeleting ? 0.7 : 1,
        transition: 'background-color 0.2s'
      }}
    >
      {isDeleting ? 'Cancelling...' : 'Cancel Order'}
    </button>
  );
}
