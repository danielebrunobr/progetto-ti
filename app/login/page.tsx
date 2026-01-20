"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

export default function LoginPage() {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const { setUsername } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setIsOpen(false);
    setIsSuccess(false);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password }),
      });

      const data = await res.json();
      const success = res.ok;

      setMessage(data.message || data.error);
      setIsSuccess(success);
      setIsOpen(true);

      if (success) {
        // Salva l'username nel localStorage e nel contesto per aggiornare la Navbar dopo aver eseguito l'accesso
        localStorage.setItem("username", usernameInput);
        setUsername(usernameInput);

        setUsernameInput("");
        setPassword("");

        // Redirect automatico alla home
        router.push("/");
      }

      // Chiudi il popup dopo 3 secondi
      setTimeout(() => setIsOpen(false), 3000);
    } catch {
      setMessage("Errore di rete");
      setIsSuccess(false);
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 3000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl w-full max-w-md flex flex-col items-center space-y-6 transition-transform transform hover:scale-105 duration-300"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-center">
          Accedi al tuo account
        </h1>

        {/* Campo username */}
        <input
          type="text"
          name="username"                 
          autoComplete="username"         
          placeholder="Username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          required
        />

        {/* Campo password */}
        <input
          type="password"
          name="password"                 // 'name' identifica il campo password
          autoComplete="current-password" // 'autocomplete' indica al browser che si tratta della password corrente dell'utente
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Accedi
        </button>
      </form>

      {/* Popup di insuccesso e di successo del login */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform scale-95 animate-scaleUp">
            <div className="text-5xl mb-4">{isSuccess ? "✅" : "❌"}</div>
            <p className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-6">{message}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* Sezione relativa alle animazioni della pagina */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
