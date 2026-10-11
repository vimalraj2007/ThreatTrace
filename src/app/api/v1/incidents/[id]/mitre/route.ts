import { NextResponse } from "next/server";
import { mockMitreTechniques } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockMitreTechniques,
  });
}
