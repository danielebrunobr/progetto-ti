"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoriteContext";
import { Heart, ShoppingCart, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { username, setUsername } = useUser();
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  const pathname = usePathname();
  const [animate, setAnimate] = useState(false);

  // Animazione badge carrello
  useEffect(() => {
    if (cartItems.length > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartItems.length]);

  // Sincronizzazione storage
  useEffect(() => {
    const handleStorage = () => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setUsername]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-900 transition-all duration-300">
      <div className="max-w-[1500px] mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Parte relativa al logo */}
        <Link href="/" className="group">
          <h1 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
            Memorabilia <span className="text-indigo-600">Vault</span>
          </h1>
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          {username ? (
            <div className="flex items-center gap-6 transition-all">
              
              {/* Parte relativa al nome utente */}
              <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Member: <span className="text-gray-900 dark:text-white">{username}</span>
              </span>

              {/* Accesso alla Wishlist tramite icona */}
              <Link href="/wishlist" className="relative group p-2">
                <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${pathname === '/wishlist' ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                {favorites.length > 0 && (
                  <span className="absolute top-0 right-0 bg-gray-950 dark:bg-white text-white dark:text-gray-900 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Accesso al carrello tramite icona */}
              <Link href="/cart" className="relative group p-2">
                <ShoppingCart className={`w-5 h-5 transition-transform group-hover:scale-110 ${pathname === '/cart' ? 'text-indigo-600' : 'text-gray-400'}`} />
                {cartItems.length > 0 && (
                  <span className={`absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-200 ${animate ? "scale-125" : "scale-100"}`}>
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Accesso all'area personale (Vault Area) tramite icona */}
              <Link 
                href="/profile" 
                className={`flex items-center gap-2 group p-1 pr-3 rounded-full border transition-all ${pathname === '/profile' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200'}`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-[10px] text-white dark:text-gray-900 font-black uppercase">
                  {username.substring(0, 2)}
                </div>
                <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-indigo-600">
                  Vault Area
                </span>
              </Link>

              {/* Funzione di logout dall'account tramite icona */}
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors px-4"
              >
                Accedi
              </Link>
              <Link
                href="/register"
                className="bg-gray-950 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95"
              >
                Registrati
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}