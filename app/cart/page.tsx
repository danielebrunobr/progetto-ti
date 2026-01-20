"use client";

import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function CartPage() {
 
  const { cartItems, removeFromCart, addToCart, removeOne, clearCart } = useCart();
  const { username } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 

  //Logica per gestire il subtotale della spesa, con spedizione gratis sopra i 500€//
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!username) {
      alert("Accedi per confermare l'acquisizione.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cartItems, 
          totalPrice: total, 
          username 
        }),
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        setShowSuccess(true); 

        // Aspetta 2 secondi per far vedere il messaggio di successo, poi torna in Home

        setTimeout(() => {
          router.push("/"); 
        }, 2000);
        
      } else {
        alert("Errore: " + data.error);
        setIsProcessing(false);
      }
    } catch (err) {
      alert("Errore di connessione.");
      setIsProcessing(false);
    }
  };


  // Se l'acquisto è andato a buon fine, mostriamo una schermata di successo dedicata e facciamo attendere 
  //l'utente per poi riportarlo alla Home
  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-6">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <CheckCircle2 className="w-24 h-24 text-indigo-600 mx-auto mb-8 animate-bounce" />
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Acquisizione Completata</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            I tuoi cimeli sono stati trasferiti nel Vault personale.
          </p>
          <p className="mt-8 text-indigo-600 font-black text-[10px] uppercase animate-pulse">
            Reindirizzamento alla Home in corso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        <header className="mb-16 border-b border-gray-100 dark:border-gray-900 pb-10">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">
            Cart <span className="text-indigo-600">Review</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">
            Account: <span className="text-gray-900 dark:text-white">{username || "Ospite"}</span>
          </p>
        </header>

        {/* Gestione Carrello Vuoto */}

        {cartItems.length === 0 ? (
          <div className="text-center py-32 bg-gray-50/50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
            <p className="font-black uppercase text-xs tracking-widest text-gray-400 mb-8">Nessun cimelio nel carrello</p>
            <Link href="/" className="bg-gray-950 dark:bg-white text-white dark:text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all hover:scale-105">
              Esplora Collezioni
            </Link>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-20">

            {/* Lista articoli all'interno del carrello */}
            <div className="flex-1 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl">
                  <div className="relative flex-shrink-0">
                    <img src={item.image} className="w-32 h-32 object-cover rounded-[2rem] shadow-lg" alt={item.name} />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 block">{item.sport}</span>
                    <h3 className="font-black uppercase text-lg tracking-tight mb-1">{item.name}</h3>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                      <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-2 border border-gray-100 dark:border-gray-700">
                        <button onClick={() => removeOne(item.id)} className="p-1 hover:text-indigo-600 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="mx-4 font-black text-xs w-6 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 hover:text-indigo-600 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-gray-400">× €{item.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-center md:items-end gap-2">
                    <p className="text-2xl font-black italic">€{(item.price * item.quantity).toLocaleString()}</p>
                    
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Parte di pagina relativa al completamento */}
            <div className="w-full xl:w-[400px]">
              <div className="bg-gray-950 text-white p-12 rounded-[4rem] sticky top-32 shadow-2xl">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 opacity-50 text-center">Checkout </h2>
                
                <div className="space-y-6 mb-12 border-b border-white/10 pb-12">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="opacity-60">Valore Cimeli</span>
                    <span>€{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="opacity-60">Spedizione</span>
                    <span className={shipping === 0 ? "text-indigo-400" : ""}>
                      {shipping === 0 ? "Gratuita" : `€${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-12">
                  <span className="text-[10px] font-black uppercase tracking-widest">Totale Finale</span>
                  <span className="text-4xl font-black italic text-indigo-400">€{total.toLocaleString()}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-6 rounded-full font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-xl active:scale-95 ${
                    isProcessing 
                      ? "bg-white/10 text-white/30 cursor-not-allowed" 
                      : "bg-white text-black hover:bg-indigo-500 hover:text-white"
                  }`}
                >
                  {isProcessing ? "Transazione in corso..." : "Conferma Acquisto"}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}