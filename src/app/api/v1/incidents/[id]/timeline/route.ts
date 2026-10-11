import { NextResponse } from "next/server";
import { mockTimelineEvents } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockTimelineEvents,
  });
}
