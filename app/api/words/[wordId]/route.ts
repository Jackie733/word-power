import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { wordId: string } }
) {
  const { wordId } = params;

  if (!wordId) {
    return NextResponse.json({ error: "Word ID is required" }, { status: 400 });
  }

  try {
    await prisma.word.delete({
      where: {
        id: wordId,
      },
    });

    return NextResponse.json(
      { message: "Word deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting word:", error);
    // Handle cases where the word might not be found (e.g., already deleted)
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete word" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
