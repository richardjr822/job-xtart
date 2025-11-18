import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import { USER_ROLES } from "@/constants";
import { z } from "zod";

// ----------------------
// Schema
// ----------------------
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z
    .string()
    .min(10, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
  role: z.enum(Object.values(USER_ROLES) as [string, ...string[]], {
    message: "Invalid user role",
  }),
});

// Type for validated data
type RegisterData = z.infer<typeof registerSchema>;

// ----------------------
// POST Route (Typed)
// ----------------------
export async function POST(request: NextRequest) {
  try {
    let body: RegisterData;

    // Parse JSON
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid or missing JSON body" },
        { status: 400 }
      );
    }

    // Validate
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, phone, role } = validation.data;

    // DB connection
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Check existing
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert user
    const result = await usersCollection.insertOne({
      email,
      phone: phone || null,
      passwordHash: hashedPassword,
      role,
      createdAt: new Date(),
      emailVerified: true,
    });

    return NextResponse.json(
      {
        message: "User registered successfully.",
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    // Duplicate key
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
