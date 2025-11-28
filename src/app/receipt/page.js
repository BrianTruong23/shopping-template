'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../cart/cart.module.css';

export default function ReceiptPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    } else {
      // No order data, redirect to home
      router.push('/');
    }
  }, [router]);

  if (!orderData) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  const orderDate = new Date(orderData.timestamp);

  return (
    <main className={styles.main}>
      <div className={styles.container} style={{ maxWidth: '800px', padding: '60px 24px' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '50%',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
          }}>
            ✓
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '12px'
          }}>
            Order Successful!
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            Thank you for your purchase
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: '#10b981',
            fontWeight: '600'
          }}>
            📧 Receipt sent to {orderData.email}
          </p>
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '24px',
            borderBottom: '2px solid #f1f5f9',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                Order Details
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Order ID: {orderData.orderID}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Date: {orderDate.toLocaleDateString()} {orderDate.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#475569',
              marginBottom: '16px'
            }}>
              Items Purchased
            </h3>
            {orderData.items.map((item) => (
              <div
                key={item.cartId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  {item.customizations && (
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      <div>String: {item.customizations.stringType}</div>
                      <div>Tension: {item.customizations.tension} lbs</div>
                      <div>Grip: {item.customizations.gripType}</div>
                      <div>Color: {item.customizations.stringColor}</div>
                    </div>
                  )}
                </div>
                <div style={{
                  fontWeight: '700',
                  color: '#0f172a',
                  fontSize: '1.1rem'
                }}>
                  ${item.totalPrice}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Information */}
          {orderData.deliveryMethod && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#475569',
                marginBottom: '16px'
              }}>
                {orderData.deliveryMethod === 'shipping' ? 'Shipping Address' : 'Pickup Information'}
              </h3>
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#0f172a',
                lineHeight: '1.6'
              }}>
                {orderData.deliveryMethod === 'shipping' && orderData.shipping ? (
                  <>
                    <div style={{ fontWeight: '600' }}>{orderData.shipping.fullName}</div>
                    <div>{orderData.shipping.address}</div>
                    <div>
                      {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}
                    </div>
                    <div>{orderData.shipping.country}</div>
                  </>
                ) : orderData.deliveryMethod === 'pickup' && orderData.pickup ? (
                  <>
                    <div style={{ fontWeight: '600' }}>{orderData.pickup.fullName}</div>
                    <div style={{ marginTop: '8px' }}>
                      <strong>Phone:</strong> {orderData.pickup.phoneNumber}
                    </div>
                    <div style={{
                      marginTop: '12px',
                      padding: '8px',
                      background: '#fef3c7',
                      border: '1px solid #fbbf24',
                      borderRadius: '4px',
                      color: '#92400e',
                      fontSize: '0.85rem'
                    }}>
                      📍 Pickup Location: Florida - We'll call you when ready
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Payment Method */}
          {orderData.paymentMethod && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#475569',
                marginBottom: '16px'
              }}>
                Payment Method
              </h3>
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '8px',
                fontSize: '0.95rem',
                color: '#0f172a',
                fontWeight: '600'
              }}>
                {orderData.paymentMethod}
              </div>
            </div>
          )}

          <div style={{
            borderTop: '2px solid #f1f5f9',
            paddingTop: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              color: '#64748b'
            }}>
              <span>Subtotal</span>
              <span>${orderData.subtotal || orderData.total}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              color: '#64748b'
            }}>
              <span>Shipping</span>
              <span>${orderData.shippingCost || 0}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a'
            }}>
              <span>Total</span>
              <span>${orderData.total}</span>
            </div>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <Link
            href="/shop"
            style={{
              display: 'inline-block',
              background: '#0f172a',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: 'white',
              color: '#0f172a',
              padding: '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s'
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
