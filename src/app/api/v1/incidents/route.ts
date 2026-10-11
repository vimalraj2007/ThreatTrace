import { NextResponse } from "next/server";
import { mockIncidents } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockIncidents
  });
}
