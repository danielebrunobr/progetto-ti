import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", 
      database: "memorabilia",
    });

    console.log("Connessione MySQL avvenuta con successo!");

  
const [rows] = await connection.execute(
  "SELECT id, name, price, image, sport, rating, reviewCount, stock FROM products"
);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    
    console.error("Errore DB:", error.code, error.message);

    let errorMessage = "Errore nel DB";

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      errorMessage = "Accesso negato: controlla user/password";
    } else if (error.code === "ER_BAD_DB_ERROR") {
      errorMessage = "Database inesistente: controlla il nome del DB";
    }

    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}
