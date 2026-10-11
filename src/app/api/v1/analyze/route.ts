import { NextResponse } from "next/server";
import { mockIncidents, mockGraphData } from "@/data/mockData";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const incidentId = body.incidentId || "INC-001";
    const incident = mockIncidents.find(i => i.id === incidentId) || mockIncidents[0];

    return NextResponse.json({
      success: true,
      data: {
        incident,
        graph: mockGraphData
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Analysis engine failed to execute correlation algorithms" },
      { status: 500 }
    );
  }
}
