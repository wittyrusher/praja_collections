'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICartItem, ICart } from '../types/cart';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cart: ICart;
  addToCart: (item: ICartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ICart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: ICartItem) => {
    const existingItem = cart.items.find(
      (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
    );

    setCart((prevCart) => {
      const existing = prevCart.items.find(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      );

      let newItems;
      if (existing) {
        newItems = prevCart.items.map((i) =>
          i.productId === item.productId && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...prevCart.items, item];
      }

      const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return { items: newItems, totalItems, totalPrice };
    });

    // ✅ Toast called outside the updater — no side effects inside setState
    toast.success(existingItem ? 'Item quantity updated' : 'Item added to cart');
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((i) => i.productId !== productId);
      const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items: newItems, totalItems, totalPrice };
    });

    // ✅ Toast called outside the updater
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
      const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { items: newItems, totalItems, totalPrice };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cart.totalPrice;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}