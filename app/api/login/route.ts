import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "memorabilia",
    });

    const [rows]: any = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 401 });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Password errata" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login effettuato con successo!" });
  } catch (err: any) {
    return NextResponse.json({ error: "Errore server: " + err.message }, { status: 500 });
  }
}
