import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const { productId, newRating } = await req.json();

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "memorabilia",
    });

    // Recuperiamo i dati attuali del prodotto
    const [rows]: any = await connection.execute(
      "SELECT rating, reviewCount FROM products WHERE id = ?",
      [productId]
    );

    if (rows.length === 0) return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });

    const currentRating = Number(rows[0].rating);
    const currentCount = Number(rows[0].reviewCount);

    //Metodo di calcolo della nuova media
    const updatedCount = currentCount + 1;
    const updatedRating = ((currentRating * currentCount) + newRating) / updatedCount;

    // Aggiorniamo il database
    await connection.execute(
      "UPDATE products SET rating = ?, reviewCount = ? WHERE id = ?",
      [updatedRating.toFixed(1), updatedCount, productId]
    );

    await connection.end();
    return NextResponse.json({ success: true, updatedRating, updatedCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}