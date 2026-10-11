import { NextResponse } from "next/server";
import { mockIncidents } from "@/data/mockData";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incident = mockIncidents.find((i) => i.id.toLowerCase() === id.toLowerCase()) || mockIncidents[0];

  return NextResponse.json({
    success: true,
    data: incident,
  });
}
