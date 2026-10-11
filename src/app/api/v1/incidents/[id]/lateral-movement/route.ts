import { NextResponse } from "next/server";
import { mockLateralMovementSteps } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockLateralMovementSteps,
  });
}
