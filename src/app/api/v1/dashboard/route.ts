import { NextResponse } from "next/server";
import { initialStats } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: initialStats
  });
}
