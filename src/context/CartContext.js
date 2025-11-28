'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../lib/supabase/client';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load cart based on user state
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Load cart from Supabase for logged-in users
        const { data, error } = await supabase
          .from('user_carts')
          .select('items')
          .eq('user_id', user.id)
          .single();

        if (!error && data?.items) {
          // Merge with any local cart items
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            const localItems = JSON.parse(localCart);
            // Merge carts (avoid duplicates)
            const mergedCart = [...data.items];
            localItems.forEach(localItem => {
              const exists = mergedCart.some(item => 
                item.id === localItem.id && 
                JSON.stringify(item.customization) === JSON.stringify(localItem.customization)
              );
              if (!exists) {
                mergedCart.push(localItem);
              }
            });
            setCart(mergedCart);
            // Save merged cart back to Supabase
            await supabase
              .from('user_carts')
              .upsert({ user_id: user.id, items: mergedCart });
            // Clear local storage after merge
            localStorage.removeItem('cart');
          } else {
            setCart(data.items);
          }
        } else {
          // No cart in Supabase, check localStorage and migrate
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            const localItems = JSON.parse(localCart);
            setCart(localItems);
            // Save to Supabase
            await supabase
              .from('user_carts')
              .upsert({ user_id: user.id, items: localItems });
            localStorage.removeItem('cart');
          }
        }
      } else {
        // Guest user: load from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [user]); // React to user changes from AuthContext

  // Save cart to Supabase or localStorage whenever it changes
  useEffect(() => {
    if (loading) return; // Don't save during initial load

    const saveCart = async () => {
      if (user) {
        // Save to Supabase for logged-in users
        await supabase
          .from('user_carts')
          .upsert({ user_id: user.id, items: cart });
      } else {
        // Save to localStorage for guests
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    };

    saveCart();
  }, [cart, user, loading]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, { ...item, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
