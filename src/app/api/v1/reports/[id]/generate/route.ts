import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    data: {
      reportId: `REP-${id}`,
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/v1/reports/${id}`
    }
  });
}
