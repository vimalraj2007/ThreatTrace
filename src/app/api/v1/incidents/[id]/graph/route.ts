import { NextResponse } from "next/server";
import { mockGraphData } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockGraphData,
  });
}
