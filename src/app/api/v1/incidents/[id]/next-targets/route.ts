import { NextResponse } from "next/server";
import { mockNextTargets } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockNextTargets,
  });
}
