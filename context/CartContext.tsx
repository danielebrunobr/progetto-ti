"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Struttura dati del prodotto nel carrello [cite: 8]
export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  sport: string;
  quantity: number; // Gestisce il raggruppamento di oggetti uguali [cite: 24]
};

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void; // Rimuove tutto l'oggetto (Cestino)
  removeOne: (id: number) => void;      // Toglie solo una unità (Tasto Meno)
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // Carica il carrello dal browser all'avvio [cite: 3, 6]
  useEffect(() => {
    const savedCart = localStorage.getItem("vault_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Errore caricamento carrello:", e);
      }
    }
  }, []);

  // Salva automaticamente ogni volta che il carrello cambia [cite: 3, 5]
  useEffect(() => {
    localStorage.setItem("vault_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Aggiunge un prodotto o aumenta la quantità se già presente [cite: 24]
  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Logica per il tasto "Meno": scala di 1 o rimuove se era l'ultimo [cite: 26, 27]
  const removeOne = (id: number) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  // Rimuove completamente il prodotto (Tasto Trash) [cite: 24, 27]
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, removeOne, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};