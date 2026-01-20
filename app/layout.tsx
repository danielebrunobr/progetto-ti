//Rendo i vari dati disponibili in tutte le pagine//

import { CartProvider } from "../context/CartContext";
import { UserProvider } from "../context/UserContext";
import { FavoriteProvider } from "../context/FavoriteContext";
import Navbar from "./components/navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Avvolgiamo l'app nei "Provider" per gestire i dati globali (Utente, Carrello, Preferiti) */}
        <UserProvider>
          <CartProvider>
            <FavoriteProvider>
              <Navbar />
              {/* 'children' contiene il contenuto specifico della pagina che l'utente sta visitando */}
              <main className="pt-20">{children}</main>
            </FavoriteProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
