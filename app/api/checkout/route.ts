// ecommerce-platform/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { items } = await request.json();

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product with ID ${item.id} not found` },
          { status: 404 }
        );
      }
      if (item.size) {
        const sizeIndex = product.sizes.findIndex((s: any) => s.size === item.size);
        if (sizeIndex === -1 || product.sizes[sizeIndex].stock < item.quantity) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for ${item.name}, size ${item.size}` },
            { status: 400 }
          );
        }
        product.sizes[sizeIndex].stock -= item.quantity;
      } else if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        );
      } else {
        product.stock -= item.quantity;
      }
      await product.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}