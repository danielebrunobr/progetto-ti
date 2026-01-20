"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Definiamo il tipo Product che deve essere coerente con quello definito nella homepage
export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  sport: string;
  rating: number;
  reviewCount: number;
  stock: number;
};

interface FavoriteContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (id: number) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);


export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Carica i preferiti dal localStorage all'avvio
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Errore nel caricamento dei preferiti:", e);
      }
    }
  }, []);

  // Salva i preferiti nel localStorage ogni volta che cambiano, in modo dinamico
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);


//Aggiunge un cimelio ai preferiti
  const addFavorite = (product: Product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  //Rimuove un cimelio dai preferiti
  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

// Hook personalizzato per usare il contesto
export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorites deve essere usato all'interno di un FavoriteProvider");
  }
  return context;
};