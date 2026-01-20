"use client";

import { useCart } from "@/context/CartContext"; 
import { useFavorites } from "@/context/FavoriteContext";
import Link from "next/link";


type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  sport: string;
};

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  
  // Gestione dello spostamento di un oggetto dalla wishlist al carrello
  const moveToCart = (product: Product) => {
    addToCart(product);
    removeFavorite(product.id);
  };
 

  // Pagina che visualizzo quando la wishlist è vuota
  if (favorites.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-3">
          La Wishlist è vuota
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base mb-8 text-center max-w-md leading-relaxed">
          Non hai ancora salvato nessun cimelio sportivo. Torna allo shop per trovare i pezzi unici da collezionare.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 tracking-wide uppercase text-sm"
        >
          Esplora lo Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header della pagina wishlist */}
        <div className="mb-10 text-center md:text-left relative">
          <span className="uppercase tracking-widest text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2 block">
             La tua collezione privata
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            Preferiti <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">({favorites.length})</span>
          </h1>
          <div className="absolute -bottom-4 left-0 md:left-0 w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-50 mx-auto md:mx-0"></div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {favorites.map((product: Product) => (
            <div
              key={product.id}
              
              className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400 transition-all duration-300 flex flex-col"
            >
              
              <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/10">
                  {product.sport}
                </div>
              </div>

              
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                    <h2 className="font-black text-base text-gray-900 dark:text-white leading-snug uppercase tracking-tight line-clamp-2 mb-3">
                    {product.name}
                    </h2>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-4">
                    ${product.price.toFixed(2)}
                    </p>
                </div>
                
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  
                  {/* Bottone per spostare l'oggetto nel carrello */}
                  <button
                    onClick={() => moveToCart(product)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Sposta nel Carrello
                  </button>

                  {/* Bottone Cestino per rimuovere l'oggetto dalla wishlist */}
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    title="Rimuovi definitivamente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}