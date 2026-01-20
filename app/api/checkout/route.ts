import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  let connection;
  try {
    const { cartItems, totalPrice, username } = await req.json();

    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "memorabilia",
    });

    const [userRows]: any = await connection.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    
    const userId = userRows[0]?.id;
    if (!userId) {
      return NextResponse.json({ error: "Accesso richiesto." }, { status: 401 });
    }

    await connection.beginTransaction();

    //Inizialmente viene creato l'ordine
    const [orderResult]: any = await connection.execute(
      "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)",
      [userId, totalPrice, "In elaborazione"]
    );
    const orderId = orderResult.insertId;

    //Raggruppo ogni riga nel carrello, e gestisco la quantità
    for (const item of cartItems) {
      
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, price_at_purchase, quantity) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.price, item.quantity]
      );

      //Aggiorno lo stock rimuovendo la quanità di prodotto acquistata
      await connection.execute(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [item.quantity, item.id, item.quantity]
      );
    }

    await connection.commit();
    await connection.end();

    return NextResponse.json({ success: true, orderId });

  } catch (error: any) {
    if (connection) {
      await connection.rollback();
      await connection.end();
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}