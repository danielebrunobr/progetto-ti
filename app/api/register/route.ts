import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username e password sono obbligatori" },
        { status: 400 }
      );
    }

    // Hash della password per aumentare la sicurezza
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connessione MySQL
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "memorabilia",
    });

    // Inserimento nuovo utente
    await connection.execute(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, hashedPassword]
    );

    await connection.end();

    return NextResponse.json({ message: "Registrazione avvenuta con successo!" });
  } catch (error: any) {
    console.error("Errore DB:", error.code, error.message);

    let errorMessage = "Errore durante la registrazione";

    if (error.code === "ER_DUP_ENTRY") {
      errorMessage = "Username già esistente";
    }

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}
