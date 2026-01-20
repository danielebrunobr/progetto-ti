"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cartItems } = useCart();

  return (
    //Parte relativa al titolo in alto a sinistra, rimane presente in qualsiasi pagina io sia
    <header className="flex justify-between items-center px-8 py-5 bg-[var(--background)] dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <Link href="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-[var(--foreground)] hover:opacity-80 transition-opacity">
        <span>🏆</span>
        <span>Memorabilia Store</span>
      </Link>

      
    </header>
  );
}