import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

// ----------------------
// Validation Schema
// ----------------------
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// ----------------------
// POST Login Route
// ----------------------
export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    // Parse JSON
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid or missing JSON body" },
        { status: 400 }
      );
    }

    // Validate body
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Connect to DB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Find user
    const user = await usersCollection.findOne<{ 
      _id: any; 
      email: string; 
      passwordHash?: string; 
      password?: string 
    }>({ email });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const hash = user.passwordHash || user.password;
    if (!hash) {
      return NextResponse.json({ message: "No password set for user" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, hash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "JWT_SECRET environment variable is not set." },
        { status: 500 }
      );
    }

    const token = jwt.sign(tokenPayload, secret, { expiresIn: "1h" });

    // Set cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { id: user._id.toString(), email: user.email },
      },
      { status: 200 }
    );

    response.cookies.set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
