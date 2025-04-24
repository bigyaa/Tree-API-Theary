import { initDb } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const db = await initDb()
    return NextResponse.json(db.data.trees)
}