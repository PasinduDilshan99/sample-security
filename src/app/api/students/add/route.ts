import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const backendRes = await fetch("http://localhost:8080/api/v0/students", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  return NextResponse.json(data);
}
