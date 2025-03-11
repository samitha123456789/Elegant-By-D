// ecommerce-platform/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product";
import { promises as fs } from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    let imagePath = productData.imageUrl || existingProduct.image;
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await imageFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      imagePath = `/uploads/${fileName}`;

      if (existingProduct.image && existingProduct.image.startsWith("/uploads/")) {
        const oldImagePath = path.join(process.cwd(), "public", existingProduct.image);
        await fs.unlink(oldImagePath).catch((err) => {
          console.warn(`Failed to delete old image ${oldImagePath}: ${err.message}`);
        });
      }
    }

    productData.image = imagePath;

    if (productData.price) productData.price = Number(productData.price);
    if (productData.originalPrice) productData.originalPrice = Number(productData.originalPrice);
    if (productData.discount) productData.discount = Number(productData.discount);
    if (productData.stock) productData.stock = Number(productData.stock);

    const updatedProduct = await Product.findByIdAndUpdate(params.id, productData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (deletedProduct.image && deletedProduct.image.startsWith("/uploads/")) {
      const imagePath = path.join(process.cwd(), "public", deletedProduct.image);
      await fs.unlink(imagePath).catch((err) => {
        console.warn(`Failed to delete image ${imagePath}: ${err.message}`);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}