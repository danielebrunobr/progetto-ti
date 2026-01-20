"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import { Range, getTrackBackground } from "react-range";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  sport: string;
  rating: number;      
  reviewCount: number; 
  stock: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [maxPriceAvailable, setMaxPriceAvailable] = useState<number>(2000);
  
  const [sortOption, setSortOption] = useState<string>("relevance");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState<number | null>(null);

  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const parsed = data.map((p: Product) => ({
          ...p,
          price: Number(p.price) || 0,
          rating: Number(p.rating) || 0,
          reviewCount: Number(p.reviewCount) || 0,
          stock: Number(p.stock) || 0
        }));
        setProducts(parsed);
        setFilteredProducts(parsed);
        const max = parsed.length > 0 ? Math.max(...parsed.map((p) => p.price)) : 2000;
        setPriceRange([0, max]);
        setMaxPriceAvailable(max);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Errore caricamento:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let result = [...products].filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1] &&
        (selectedSports.length === 0 || selectedSports.includes(p.sport)) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating-desc": result.sort((a, b) => b.rating - a.rating); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": result.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: result.sort((a, b) => a.id - b.id);
    }
    
    setFilteredProducts(result);
  }, [priceRange, sortOption, selectedSports, products, searchTerm]);

  const handleRate = async (productId: number, newRating: number) => {
    setRatingLoading(productId);
    try {
      const res = await fetch("/api/products/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, newRating }),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Errore durante il voto:", err);
    } finally {
      setRatingLoading(null);
    }
  };

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Barra in alto in cui specifico la spedizione gratuita */}
      <div className="bg-gray-50 dark:bg-gray-900 py-2.5 px-8 hidden md:block border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1500px] mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <span className="text-indigo-600 font-bold">✨ SPEDIZIONE GRATUITA OLTRE I 500€</span>
        </div>
      </div>

      <main className="max-w-[1500px] mx-auto w-full p-6 md:p-10">
        
        {/* Banner e logo del sito */}
        <section className="relative h-[400px] md:h-[500px] rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl group border border-gray-100 dark:border-gray-800">
          <img 
            src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt="The Vault Banner" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center p-12 md:p-24 text-white">
            <span className="bg-blue-600 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 tracking-widest shadow-lg">Collezionali tutti</span>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-none mb-6 tracking-tighter">
              The <br/> <span className="text-blue-500">Vault</span>
            </h1>
          </div>
        </section>

        {/* Cerchi con le varie categorie che mi fungono anche da filtri di ricerca */}
        <div className="flex justify-center gap-6 md:gap-12 mb-20 overflow-x-auto pb-4 no-scrollbar">
          {[
            { name: "Tutti", icon: "💎", id: "" },
            { name: "Calcio", icon: "⚽", id: "Calcio" },
            { name: "Basket", icon: "🏀", id: "Basket" },
            { name: "Tennis", icon: "🎾", id: "Tennis" },
            { name: "Formula 1", icon: "🏎️", id: "Formula 1" },
          ].map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setSelectedSports(cat.id ? [cat.id] : [])}
              className={`flex flex-col items-center gap-4 transition-all group ${selectedSports.includes(cat.id) ? 'scale-110' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl shadow-md border-2 border-transparent group-hover:border-indigo-500 transition-all">
                {cat.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-indigo-600">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-12">
              
              
              <div className="group">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 border-b border-indigo-100 dark:border-indigo-900 pb-2">Vault Search</h3>
                <input 
                  type="text" placeholder="Cerca cimelio..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Ricerca tramite range di prezzo */}
              <div className="space-y-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-4 border-b border-indigo-100 dark:border-indigo-900 pb-2">Range di Prezzo</h3>
                <div className="flex justify-between text-xs font-black mb-4">
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">€{priceRange[0]}</span>
                  <span className="bg-indigo-600 text-white px-2 py-1 rounded shadow-md">€{priceRange[1]}</span>
                </div>
                <div className="px-3 h-10 flex items-center">
                  <Range
                    step={10} min={0} max={maxPriceAvailable} values={priceRange}
                    onChange={(values) => setPriceRange(values as [number, number])}
                    renderTrack={({ props, children }) => (
                      <div {...props} className="h-1.5 w-full rounded-full" style={{ background: getTrackBackground({ values: priceRange, colors: ["#F3F4F6", "#4F46E5", "#F3F4F6"], min: 0, max: maxPriceAvailable }) }}>{children}</div>
                    )}
                    renderThumb={({ props, isDragged }) => (
                      <div {...props} key={props.key} className={`h-8 w-8 flex items-center justify-center outline-none z-30 transition-transform ${isDragged ? 'scale-110' : ''}`}>
                        <div className={`h-5 w-5 rounded-full bg-white border-2 border-indigo-600 shadow-xl ${isDragged ? 'ring-4 ring-indigo-500/20' : ''}`} />
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Ordinamento degli oggetti secondo vari criteri*/}
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 border-b border-indigo-100 dark:border-indigo-900 pb-2">Ordina Per</h3>
                <div className="flex flex-col gap-2">
                  {[{id:"relevance",l:"Rilevanza"},{id:"price-asc",l:"Prezzo: Min"},{id:"price-desc",l:"Prezzo: Max"},{id:"rating-desc",l:"Top Recensioni"}].map((o)=>(
                    <button key={o.id} onClick={()=>setSortOption(o.id)} className={`text-left text-[10px] font-black uppercase py-3 px-4 rounded-xl transition-all ${sortOption===o.id?'bg-indigo-600 text-white shadow-lg':'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>{o.l}</button>
                  ))}
                </div>
              </div>

              {/* Ricerca relativa agli sport, anche più di uno contemporaneamente */}
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 border-b border-indigo-100 dark:border-indigo-900 pb-2">Sport</h3>
                <div className="flex flex-col gap-4">
                  {["Calcio", "Basket", "Tennis", "Formula 1"].map((sport) => (
                    <label key={sport} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={selectedSports.includes(sport)} onChange={() => toggleSport(sport)} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                      <span className={`text-[11px] font-black uppercase transition-colors ${selectedSports.includes(sport) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-900'}`}>{sport}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Griglia dei prodotti */}
          <section className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12">
              {filteredProducts.map((product) => {
                const isFav = favorites.some((p: any) => p.id === product.id);
                return (
                  <div key={product.id} className="group flex flex-col transition-all duration-500">
                    
                    {/* Immagine con Badge e Tasto Preferiti */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-gray-900 mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
                      <img 
                        src={product.image} alt={product.name} 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock === 0 ? 'grayscale opacity-60' : ''}`} 
                      />
                      
                      {/* Badge per gestire l'eventuale scarsità del prodotto */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {product.stock === 0 && <span className="bg-red-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg">Esaurito</span>}
                        {product.stock === 1 && <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg animate-pulse">Pezzo Unico</span>}
                        {product.stock > 1 && <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg">Disponibile</span>}
                      </div>

                      {/* Bottone per mettere o rimuovere l'oggetto dai preferiti */}
                      <button 
                        onClick={() => isFav ? removeFavorite(product.id) : addFavorite(product)}
                        className={`absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90 ${isFav ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-900 opacity-0 group-hover:opacity-100'}`}
                      >
                        <span className="text-lg">{isFav ? "❤️" : "🖤"}</span>
                      </button>

                      {/* Badge Sport */}
                      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase px-4 py-2 rounded-xl border border-white/10">
                        {product.sport}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center px-4">
                      <h3 className="font-black text-lg uppercase tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                      
                      {/* Stelle Interattive per la valutazione del prodotto */}
                      <div className={`flex gap-1 mb-4 relative ${ratingLoading === product.id ? 'opacity-30' : ''}`}>
                        {[1, 2, 3, 4, 5].map((s) => {
                          const fill = Math.min(Math.max(product.rating - (s - 1), 0), 1) * 100;
                          return (
                            <button key={s} onClick={() => handleRate(product.id, s)} className="hover:scale-125 transition-transform">
                              <svg width="22" height="22" viewBox="0 0 24 24">
                                <defs><linearGradient id={`g-${product.id}-${s}`}><stop offset={`${fill}%`} stopColor="#FACC15"/><stop offset={`${fill}%`} stopColor="#E5E7EB"/></linearGradient></defs>
                                <path fill={`url(#g-${product.id}-${s})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            </button>
                          );
                        })}
                        <span className="text-[10px] font-black text-gray-400 ml-1 uppercase">({product.reviewCount})</span>
                      </div>

                      <p className="text-2xl font-black text-indigo-600 mb-6 italic tracking-tighter">€{product.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                      
                      <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full py-4.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all shadow-xl active:scale-95 
                          ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-950 text-white hover:bg-indigo-600'}`}
                      >
                        {product.stock === 0 ? 'Esaurito' : 'Aggiungi al Carrello'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Badge finali per dare profondità alla */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-16 py-24 border-t border-gray-100 dark:border-gray-800 mt-20 text-center">
          {[
            { t: "Originalità", d: "Certificazione COA.", i: "🛡️" },
            { t: "Safe Delivery", d: "Corriere blindato.", i: "📦" },
            { t: "Esclusività", d: "Pezzi unici.", i: "💎" },
            { t: "Expertise", d: "Valutazione storica.", i: "📜" },
          ].map((b) => (
            <div key={b.t}>
              <div className="text-4xl mb-4">{b.i}</div>
              <h4 className="font-black uppercase text-[10px] tracking-widest mb-2 text-indigo-600">{b.t}</h4>
              <p className="text-gray-400 text-[10px] font-bold">{b.d}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 text-center">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-4">🏆 Memorabilia <span className="text-indigo-600">Vault</span></h2>
        <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.8em]">© 2026 Memorabilia Vault S.r.l.</p>
      </footer>
    </div>
  );
}