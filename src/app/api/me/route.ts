import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendRes = await fetch("http://localhost:8080/api/v0/user/me", {
      method: "GET",
      credentials: "include", // send auth-token + refresh-token
    });

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
