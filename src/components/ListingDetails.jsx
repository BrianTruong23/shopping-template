'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../app/listing/listing.module.css';

export default function ListingDetails({ listing }) {
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
      <div 
        className={styles.heroImage}
        style={{ backgroundColor: listing.color }}
      >
        <div className={styles.placeholderOverlay}>
          <span>Racket Hero Image Placeholder</span>
        </div>
        <div className={styles.overlay}></div>
        <div className={`${styles.container} ${styles.heroContent}`}>
          <Link href="/shop" className={styles.backLink}>← Back to Collection</Link>
          <span className={styles.heroSeries}>{listing.series}</span>
          <h1 className={styles.title}>{listing.title}</h1>
        </div>
      </div>

      <div className={`${styles.container} ${styles.contentWrapper}`}>
        <div className={styles.mainInfo}>
          <section className={styles.description}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <p>{listing.description}</p>
          </section>

          <section className={styles.specsSection}>
            <h2 className={styles.sectionTitle}>Technical Specifications</h2>
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Weight / Grip</span>
                <span className={styles.specValue}>{listing.specs.weight}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Balance Point</span>
                <span className={styles.specValue}>{listing.specs.balance}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Stiffness</span>
                <span className={styles.specValue}>{listing.specs.stiffness}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>String Tension</span>
                <span className={styles.specValue}>{listing.specs.tension}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Frame Material</span>
                <span className={styles.specValue}>{listing.specs.frame}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Shaft Material</span>
                <span className={styles.specValue}>{listing.specs.shaft}</span>
              </div>
            </div>
          </section>

          <section className={styles.features}>
            <h2 className={styles.sectionTitle}>Technologies</h2>
            <ul className={styles.featureList}>
              {listing.technologies.map((tech, index) => (
                <li key={index} className={styles.featureItem}>{tech}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className={styles.bookingCard}>
          <div className={styles.priceTag}>
            <span className={styles.amount}>${calculateTotal()}</span>
          </div>

          <div className={styles.customizationForm}>
            <div className={styles.formGroup}>
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
                <div className={styles.formGroup}>
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
                <div className={styles.formGroup}>
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

            <div className={styles.formGroup}>
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

          <button className={styles.bookBtn} onClick={handleAddToCart}>
            Add to Cart
          </button>
          <p className={styles.note}>Free shipping on orders over $100</p>
        </aside>
      </div>
    </main>
  );
}
