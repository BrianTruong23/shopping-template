import { createClient } from '../../../lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './orderDetails.module.css';
import CancelOrderButton from './CancelOrderButton';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch order with products
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_products(*)')
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Verify ownership (case-insensitive email check)
  if (order.customer_email.toLowerCase() !== user.email?.toLowerCase()) {
    redirect('/orders');
  }

  // Check if order is cancellable (< 30 mins)
  const createdAt = new Date(order.created_at).getTime();
  const now = Date.now();
  const diffInMinutes = (now - createdAt) / (1000 * 60);
  const isCancellable = diffInMinutes <= 30;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/orders" className={styles.backLink}>← Back to Orders</Link>
          <h1 className={styles.title}>Order Details</h1>
          <p className={styles.subtitle}>Order #{order.id}</p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Date Placed</span>
                <span className={styles.value}>
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Status</span>
                <span className={styles.value} style={{ textTransform: 'capitalize' }}>
                  {order.status}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Total Amount</span>
                <span className={styles.value}>${order.total_price.toFixed(2)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{order.customer_email}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Items</h2>
            <div className={styles.productsList}>
              {order.order_products && order.order_products.length > 0 ? (
                order.order_products.map((product: any) => (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{product.product_name}</span>
                      <span className={styles.productMeta}>
                        Qty: {product.quantity} × ${product.unit_price}
                      </span>
                    </div>
                    <div className={styles.productTotal}>
                      ${(product.quantity * product.unit_price).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No items found for this order.</p>
              )}
            </div>
          </div>

          {isCancellable && (
            <div className={styles.actions}>
              <CancelOrderButton orderId={order.id} />
              <p className={styles.cancelNote}>
                You can cancel this order within 30 minutes of placement.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
