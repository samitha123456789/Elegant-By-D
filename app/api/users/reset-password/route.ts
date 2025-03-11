// app/api/users/reset-password/route.ts
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
  const { userId, newPassword } = await request.json();

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}