"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserContextType = {
  username: string | null;
  setUsername: (name: string | null) => void;
};

//Inizializziamo il contesto con valori di default
const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: () => {},
});

//Permette ad ogni pagina di sapere quale è l'utente corrente
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);

  // Recupera l'username dal localStorage appena si accede alla pagina
  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  // Logout automatico quando si chiude o ricarica la pagina, sessione temporanea
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("username");
      setUsername(null);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
