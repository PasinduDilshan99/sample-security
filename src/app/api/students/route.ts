import { NextResponse } from "next/server";

export async function GET() {
  const backendRes = await fetch("http://localhost:8080/api/v0/students", {
    method: "GET",
    credentials: "include",
  });

  const data = await backendRes.json();
  return NextResponse.json(data);
}
