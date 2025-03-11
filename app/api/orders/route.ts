// ecommerce-platform/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";
import User from "@/lib/db/models/user";

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const recent = searchParams.get("recent");

  if (recent) {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");
    return NextResponse.json({ success: true, data: orders });
  }

  const orders = await Order.find(userId ? { userId } : {}).populate("userId", "name email");
  return NextResponse.json({ success: true, data: orders });
}

export async function POST(request: NextRequest) {
  await dbConnect();
  const orderData = await request.json();
  const order = await Order.create(orderData);
  await User.findByIdAndUpdate(orderData.userId, { $push: { orders: order._id } });
  return NextResponse.json({ success: true, data: order }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  await dbConnect();
  const { trackingNumber, status } = await request.json();
  const order = await Order.findOneAndUpdate(
    { trackingNumber },
    { status },
    { new: true }
  );
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: order });
}