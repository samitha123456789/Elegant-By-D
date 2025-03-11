// ecommerce-platform/app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";

let lastOrder: { trackingNumber: string; timestamp: number } | null = null;

export async function POST(request: NextRequest) {
  const { trackingNumber } = await request.json();
  lastOrder = { trackingNumber, timestamp: Date.now() };
  return NextResponse.json({ success: true });
}

export async function GET() {
  if (lastOrder && Date.now() - lastOrder.timestamp < 60000) {
    return NextResponse.json({ newOrder: true, trackingNumber: lastOrder.trackingNumber });
  }
  return NextResponse.json({ newOrder: false });
}