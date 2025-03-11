// app/api/users/add-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { email, password, name } = await request.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, role: "admin" });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Add admin error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}