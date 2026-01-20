"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useFavorites } from "../../context/FavoriteContext";

type Order = {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  product_details: string;
};

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { username } = useUser();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState("ordini");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      setLoading(true);
      fetch(`/api/user/orders?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setOrders(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [username]);

  
  const totalOrders = orders.length;
  const totalInvestment = orders.reduce((acc, order) => acc + Number(order.total_price), 0);

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <p className="font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
          Accesso al Vault richiesto...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header del profilo */}
        <header className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b border-gray-100 dark:border-gray-900 pb-12">
          <div className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-[0_0_30px_rgba(79,70,229,0.3)]">
            {username.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
              <h1 className="text-5xl font-black uppercase italic tracking-tighter">{username}</h1>
            </div>
          </div>
        </header>

        {/* Informazioni sul profilo (Numero acquisti, valore totale acquistato,...) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-indigo-500 transition-all">
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest block mb-3">Acquisti Totali</span>
            <p className="text-4xl font-black italic tracking-tighter">{totalOrders}</p>
            <div className="w-8 h-1 bg-indigo-600 mt-4 rounded-full group-hover:w-16 transition-all"></div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-indigo-500 transition-all">
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest block mb-3">Valore del Vault</span>
            <p className="text-4xl font-black italic tracking-tighter">
              €{totalInvestment.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
            </p>
            <div className="w-8 h-1 bg-indigo-600 mt-4 rounded-full group-hover:w-16 transition-all"></div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-indigo-500 transition-all">
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest block mb-3">Oggetti Desiderati</span>
            <p className="text-4xl font-black italic tracking-tighter">{favorites.length}</p>
            <div className="w-8 h-1 bg-indigo-600 mt-4 rounded-full group-hover:w-16 transition-all"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Pulsante storico ordini */}
          <nav className="w-full lg:w-64 flex flex-col gap-3">
            <button 
              onClick={() => setActiveTab("ordini")} 
              className={`text-left font-black uppercase text-[10px] tracking-[0.2em] p-5 rounded-2xl transition-all ${activeTab === 'ordini' ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              📦 Storico Ordini
            </button>
            
          </nav>

          {/* Storico degli ordini effettuati dall'utente, con relativa spesa, lista acquisti, e data */}
          <section className="flex-1">
            {activeTab === "ordini" && (
              <div className="space-y-8">
                {loading ? (
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aggiornamento database...</p>
                ) : orders.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Il tuo Vault è attualmente vuoto.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between md:items-center gap-8 group hover:shadow-2xl transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Codice Ordine #{order.id}</span>
                          <span className="text-[9px] bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full font-black uppercase border border-indigo-100">
                            {order.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-black uppercase italic tracking-tight mb-2 leading-tight">
                          {order.product_details}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          Acquisito il: {new Date(order.created_at).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                      <div className="text-right border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-6 md:pt-0 md:pl-8">
                        <p className="text-3xl font-black italic tracking-tighter mb-1">
                          €{Number(order.total_price).toLocaleString('it-IT')}
                        </p>
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Saldo Certificato</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            
          </section>
        </div>
      </div>
    </div>
  );
}