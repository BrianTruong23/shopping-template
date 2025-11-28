import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import styles from './orders.module.css'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch orders for this user (by email)
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_products(*)')
    .eq('customer_email', user.email)
    .order('created_at', { ascending: false })

  // Handle case where orders table might not have been queried properly
  const ordersList = orders || []
  const hasError = error && error.code !== 'PGRST116' // PGRST116 is "no rows returned", which is OK


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order History</h1>
        <p>View all your past orders</p>
      </div>

      {hasError && (
        <div className={styles.error}>
          Error loading orders: {error.message}. 
          {error.code === '42P01' && ' (The orders table may not exist yet. Please run the SQL schema in Supabase.)'}
        </div>
      )}

      {!hasError && ordersList.length === 0 && (
        <div className={styles.empty}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h2>No orders yet</h2>
          <p>Start shopping and your orders will appear here!</p>
          <Link href="/shop" className={styles.shopButton}>
            Browse Products
          </Link>
        </div>
      )}

      {!hasError && ordersList.length > 0 && (
        <div className={styles.ordersList}>
          {ordersList.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className={styles.orderCardLink}>
              <div className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.headerInfo}>
                    <h3>Order #{order.id.slice(0, 8)}</h3>
                    <p className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={styles.headerRight}>
                    <div className={styles.orderTotal}>
                      ${order.total_price.toFixed(2)}
                    </div>
                    <span className={styles.viewDetails}>View Details →</span>
                  </div>
                </div>
                
                <div className={styles.orderPreview}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Status:</span>
                    <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Items:</span>
                    <span>{order.order_products?.length || 0} items</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
