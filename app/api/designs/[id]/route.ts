import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/designs/[id]
 * Get a specific design by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const design = await prisma.design.findFirst({
      where: {
        id: id,
        userId: session.user.id, // Ensure user owns the design
      },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    return NextResponse.json({ design });
  } catch (error) {
    console.error("Error fetching design:", error);
    return NextResponse.json(
      { error: "Failed to fetch design" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/designs/[id]
 * Update a design
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // First verify the design exists and belongs to the user
    const existingDesign = await prisma.design.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingDesign) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // Update the design
    const design = await prisma.design.update({
      where: { id: id },
      data: {
        name: body.name,
        description: body.description,
        canvasData: body.canvasData,
        previewUrl: body.previewUrl,
      },
    });

    return NextResponse.json({ design });
  } catch (error) {
    console.error("Error updating design:", error);
    return NextResponse.json(
      { error: "Failed to update design" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/designs/[id]
 * Delete a design
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // First verify the design exists and belongs to the user
    const existingDesign = await prisma.design.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingDesign) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    await prisma.design.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting design:", error);
    return NextResponse.json(
      { error: "Failed to delete design" },
      { status: 500 }
    );
  }
}

