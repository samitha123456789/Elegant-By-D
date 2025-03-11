// ecommerce-platform/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product";
import { promises as fs } from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function GET(request: NextRequest) {
  try {
    // Attempt to connect to the database
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const sale = searchParams.get("sale") === "true";
    const limit = parseInt(searchParams.get("limit") || "0");
    const search = searchParams.get("search");

    let query: any = {};
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (sale) query.discount = { $exists: true, $ne: null };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .limit(limit > 0 ? limit : 0)
      .exec();

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    // Always return JSON, even if DB connection fails
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Internal Server Error", data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const productData: any = {};

    for (const [key, value] of formData.entries()) {
      if (key !== "image") {
        if (key === "sizes") {
          productData.sizes = JSON.parse(value as string);
        } else {
          productData[key] = value === "true" ? true : value === "false" ? false : value;
        }
      }
    }

    let imagePath = productData.imageUrl || "";
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await imageFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      imagePath = `/uploads/${fileName}`;
    }

    productData.image = imagePath;

    if (productData.price) productData.price = Number(productData.price);
    if (productData.originalPrice) productData.originalPrice = Number(productData.originalPrice);
    if (productData.discount) productData.discount = Number(productData.discount);
    if (productData.stock) productData.stock = Number(productData.stock);

    const product = await Product.create(productData);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();
    if (!id) throw new Error("Product ID is required");

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const productData: any = {};

    for (const [key, value] of formData.entries()) {
      if (key !== "image") {
        if (key === "sizes") {
          productData.sizes = JSON.parse(value as string);
        } else {
          productData[key] = value === "true" ? true : value === "false" ? false : value;
        }
      }
    }

    let imagePath = productData.imageUrl || "";
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await imageFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      imagePath = `/uploads/${fileName}`;
    }
    if (imagePath) productData.image = imagePath;

    if (productData.price) productData.price = Number(productData.price);
    if (productData.originalPrice) productData.originalPrice = Number(productData.originalPrice);
    if (productData.discount) productData.discount = Number(productData.discount);
    if (productData.stock) productData.stock = Number(productData.stock);

    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop();
    if (!id) throw new Error("Product ID is required");

    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 400 }
    );
  }
}