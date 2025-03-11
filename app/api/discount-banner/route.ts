// ecommerce-platform/app/api/discount-banner/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import DiscountBanner from "@/lib/db/models/discountBanner";
import { promises as fs } from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function GET() {
  try {
    await dbConnect();
    const banner = await DiscountBanner.findOne().sort({ updatedAt: -1 });
    if (!banner) {
      return NextResponse.json({
        success: true,
        data: { text: "No discount available", backgroundColor: "#000000", backgroundImage: "", isActive: false },
      });
    }
    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const imageFile = formData.get("backgroundImage") as File | null;
    const bannerData: any = {};

    for (const [key, value] of formData.entries()) {
      if (key !== "backgroundImage") {
        bannerData[key] = value === "true" ? true : value === "false" ? false : value;
      }
    }

    let imagePath = bannerData.backgroundImage || "";
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await imageFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      imagePath = `/uploads/${fileName}`;
    }

    bannerData.backgroundImage = imagePath;
    bannerData.updatedAt = new Date();

    const existingBanner = await DiscountBanner.findOne();
    let banner;
    if (existingBanner) {
      banner = await DiscountBanner.findByIdAndUpdate(existingBanner._id, bannerData, { new: true });
    } else {
      banner = await DiscountBanner.create(bannerData);
    }

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}