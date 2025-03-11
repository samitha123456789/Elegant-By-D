import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";

export async function GET() {
  await dbConnect();
  const users = await User.find({ role: "customer" }).select("-password");
  return NextResponse.json({ success: true, data: users });
}

export async function POST(request: Request) {
  await dbConnect();
  const { name, email, password, role } = await request.json();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 });
  }
  const user = await User.create({ name, email, password, role });
  return NextResponse.json({ success: true, data: { id: user._id, name, email, role } }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await dbConnect();
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}