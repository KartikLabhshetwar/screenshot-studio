import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/designs
 * Get all designs for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const designs = await prisma.design.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        previewUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ designs });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json(
      { error: "Failed to fetch designs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/designs
 * Create a new design
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, canvasData, previewUrl } = body;

    if (!canvasData) {
      return NextResponse.json(
        { error: "Canvas data is required" },
        { status: 400 }
      );
    }

    const design = await prisma.design.create({
      data: {
        userId: session.user.id,
        name: name || "Untitled Design",
        description: description || null,
        canvasData: canvasData,
        previewUrl: previewUrl || null,
      },
    });

    return NextResponse.json({ design });
  } catch (error) {
    console.error("Error creating design:", error);
    return NextResponse.json(
      { error: "Failed to create design" },
      { status: 500 }
    );
  }
}

