import React, { createContext, useState, useCallback, useEffect } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('fitzdo_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fitzdo_cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1, size = 'M') => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product._id === product._id && item.size === size
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item
        return [...prevCart, { product, quantity, size, addedAt: Date.now() }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId, size) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product._id === productId && item.size === size)
      )
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }, [cart]);

  // Get cart count
  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Get cart savings
  const getCartSavings = useCallback(() => {
    return cart.reduce((savings, item) => {
      const itemSavings = (item.product.mrp - item.product.price) * item.quantity;
      return savings + itemSavings;
    }, 0);
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartSavings
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
