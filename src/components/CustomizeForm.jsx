'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../app/customize/customize.module.css';

export default function CustomizeForm({ listing }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const [customization, setCustomization] = useState({
    string: 'Unstrung',
    tension: '24 lbs',
    grip: 'Original',
    stringColor: 'White'
  });

  const basePrice = parseInt(listing.price.replace('$', ''));
  
  const calculateTotal = () => {
    let total = basePrice;
    if (customization.string !== 'Unstrung') total += 15;
    if (customization.grip !== 'Original') total += 5;
    return total;
  };

  const handleAddToCart = () => {
    addToCart({
      ...listing,
      customization,
      totalPrice: calculateTotal()
    });
    router.push('/cart');
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/shop" className={styles.backLink}>← Back to Shop</Link>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageSection}>
            <div 
              className={styles.racketImage}
              style={{ backgroundColor: listing.color }}
            >
              <span className={styles.imagePlaceholder}>{listing.title}</span>
              <div className={styles.overlay}></div>
            </div>
          </div>

          <div className={styles.configurator}>
            <span className={styles.series}>{listing.series}</span>
            <h1 className={styles.title}>{listing.title}</h1>
            <span className={styles.price}>${calculateTotal()}</span>

            <div className={styles.optionsGrid}>
              <div className={styles.optionGroup}>
                <label className={styles.label}>String Option (+$15)</label>
                <select 
                  className={styles.select}
                  value={customization.string}
                  onChange={(e) => setCustomization({...customization, string: e.target.value})}
                >
                  <option value="Unstrung">Unstrung (Frame Only)</option>
                  <option value="BG65">Yonex BG65 (Durability)</option>
                  <option value="BG80">Yonex BG80 (Power)</option>
                  <option value="Exbolt 63">Yonex Exbolt 63 (Control)</option>
                </select>
              </div>

              {customization.string !== 'Unstrung' && (
                <>
                  <div className={styles.optionGroup}>
                    <label className={styles.label}>Tension</label>
                    <select 
                      className={styles.select}
                      value={customization.tension}
                      onChange={(e) => setCustomization({...customization, tension: e.target.value})}
                    >
                      <option value="24 lbs">24 lbs (Recommended)</option>
                      <option value="25 lbs">25 lbs</option>
                      <option value="26 lbs">26 lbs</option>
                      <option value="27 lbs">27 lbs</option>
                      <option value="28 lbs">28 lbs</option>
                    </select>
                  </div>
                  <div className={styles.optionGroup}>
                    <label className={styles.label}>String Color</label>
                    <select 
                      className={styles.select}
                      value={customization.stringColor}
                      onChange={(e) => setCustomization({...customization, stringColor: e.target.value})}
                    >
                      <option value="White">White</option>
                      <option value="Yellow">Yellow</option>
                      <option value="Orange">Orange</option>
                      <option value="Black">Black</option>
                    </select>
                  </div>
                </>
              )}

              <div className={styles.optionGroup}>
                <label className={styles.label}>Grip Option (+$5)</label>
                <select 
                  className={styles.select}
                  value={customization.grip}
                  onChange={(e) => setCustomization({...customization, grip: e.target.value})}
                >
                  <option value="Original">Original Grip</option>
                  <option value="Super Grap">Yonex Super Grap (White)</option>
                  <option value="Towel Grip">Yonex Towel Grip (Yellow)</option>
                </select>
              </div>
            </div>

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Add to Cart - ${calculateTotal()}
            </button>

            <div className={styles.specsSummary}>
              <h3 className={styles.sectionTitle}>Quick Specs</h3>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Weight</span>
                <span className={styles.specValue}>{listing.specs.weight}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Balance</span>
                <span className={styles.specValue}>{listing.specs.balance}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Stiffness</span>
                <span className={styles.specValue}>{listing.specs.stiffness}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
