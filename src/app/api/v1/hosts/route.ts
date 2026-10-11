import { NextResponse } from "next/server";
import { mockHostsList } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockHostsList,
  });
}
