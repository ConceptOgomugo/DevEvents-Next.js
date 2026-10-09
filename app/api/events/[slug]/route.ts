import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

// Define the expected context structure for Next.js App Router dynamic routes
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectToDatabase();
    // 1. Await dynamic route parameters (Next.js 15+ requirement)
    const { slug } = await params;

    // 2. Validate route parameter
    if (!slug || typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json(
        { message: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    // 4. Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // 5. Handle non-existent resource
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    // 6. Return successful response
    return NextResponse.json(
      { message: "Event retrieved successfully", event },
      { status: 200 }
    );
  } catch (e) {
    console.error("GET /api/events/[slug] Error:", e);

    return NextResponse.json(
      {
        message: "Event retrieval failed",
        error: e instanceof Error ? e.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}