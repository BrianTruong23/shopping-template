'use client';

import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import styles from './cart.module.css';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.emptyCart}>
            <h1 className={styles.emptyTitle}>Your cart is empty</h1>
            <Link href="/shop" className={styles.continueBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Shopping Cart</h1>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.cartGrid}>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div key={item.cartId} className={styles.cartItem}>
                <div 
                  className={styles.itemImage}
                  style={{ backgroundColor: item.color }}
                >
                  {item.series}
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemName}>{item.title}</h3>
                    <span className={styles.itemPrice}>${item.totalPrice}</span>
                  </div>
                  {item.customization && (
                    <div className={styles.customizations}>
                      <span className={styles.customization}>String: {item.customization.string}</span>
                      {item.customization.string !== 'Unstrung' && (
                        <>
                          <span className={styles.customization}>Tension: {item.customization.tension}</span>
                          <span className={styles.customization}>String Color: {item.customization.stringColor}</span>
                        </>
                      )}
                      <span className={styles.customization}>Grip: {item.customization.grip}</span>
                    </div>
                  )}
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.cartId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${cartTotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>${cartTotal}</span>
            </div>
            <button 
              className={styles.checkoutBtn}
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
