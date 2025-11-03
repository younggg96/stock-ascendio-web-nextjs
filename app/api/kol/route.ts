import { NextRequest, NextResponse } from "next/server";
import { KOL, CreateKOLInput, UpdateKOLInput } from "@/lib/kolApi";

// Mock data store - In production, replace with database
let kolData: KOL[] = [
  {
    id: "1",
    name: "Elon Musk",
    username: "@elonmusk",
    platform: "twitter",
    followers: 180000000,
    description: "CEO of Tesla, SpaceX",
    avatarUrl: "",
    isTracking: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Cathie Wood",
    username: "@CathieDWood",
    platform: "twitter",
    followers: 1500000,
    description: "CEO & CIO of ARK Invest",
    avatarUrl: "",
    isTracking: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "wallstreetbets",
    username: "r/wallstreetbets",
    platform: "reddit",
    followers: 15000000,
    description: "Community for stock market discussions",
    avatarUrl: "",
    isTracking: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Graham Stephan",
    username: "@GrahamStephan",
    platform: "youtube",
    followers: 4500000,
    description: "Finance & Real Estate YouTuber",
    avatarUrl: "",
    isTracking: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "股市老司机",
    username: "@stockmaster",
    platform: "rednote",
    followers: 850000,
    description: "分享股市投资心得",
    avatarUrl: "",
    isTracking: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Meet Kevin",
    username: "@MeetKevin",
    platform: "youtube",
    followers: 2100000,
    description: "Real Estate & Stock Market Investing",
    avatarUrl: "",
    isTracking: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Warren Buffett Fan",
    username: "u/BuffettFan",
    platform: "reddit",
    followers: 250000,
    description: "Value investing discussions",
    avatarUrl: "",
    isTracking: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "投资小白日记",
    username: "@investdiary",
    platform: "rednote",
    followers: 320000,
    description: "新手投资指南",
    avatarUrl: "",
    isTracking: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET - Fetch all KOLs
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform");
    const isTracking = searchParams.get("isTracking");

    let filteredData = [...kolData];

    // Filter by platform
    if (platform) {
      filteredData = filteredData.filter((kol) => kol.platform === platform);
    }

    // Filter by tracking status
    if (isTracking !== null) {
      const tracking = isTracking === "true";
      filteredData = filteredData.filter((kol) => kol.isTracking === tracking);
    }

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("Error fetching KOLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch KOLs" },
      { status: 500 }
    );
  }
}

// POST - Create a new KOL
export async function POST(request: NextRequest) {
  try {
    const body: CreateKOLInput = await request.json();

    // Validate required fields
    if (!body.name || !body.username || !body.platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new KOL
    const newKOL: KOL = {
      id: Date.now().toString(),
      name: body.name,
      username: body.username,
      platform: body.platform,
      followers: body.followers || 0,
      description: body.description,
      avatarUrl: body.avatarUrl,
      isTracking: body.isTracking ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    kolData.push(newKOL);

    return NextResponse.json(newKOL, { status: 201 });
  } catch (error) {
    console.error("Error creating KOL:", error);
    return NextResponse.json(
      { error: "Failed to create KOL" },
      { status: 500 }
    );
  }
}

// PATCH - Update an existing KOL
export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateKOLInput & { id: string } = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Missing KOL ID" }, { status: 400 });
    }

    const index = kolData.findIndex((kol) => kol.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "KOL not found" }, { status: 404 });
    }

    // Update KOL
    kolData[index] = {
      ...kolData[index],
      ...body,
      id: body.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(kolData[index]);
  } catch (error) {
    console.error("Error updating KOL:", error);
    return NextResponse.json(
      { error: "Failed to update KOL" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a KOL
export async function DELETE(request: NextRequest) {
  try {
    const body: { id: string } = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Missing KOL ID" }, { status: 400 });
    }

    const index = kolData.findIndex((kol) => kol.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: "KOL not found" }, { status: 404 });
    }

    // Remove KOL
    kolData.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting KOL:", error);
    return NextResponse.json(
      { error: "Failed to delete KOL" },
      { status: 500 }
    );
  }
}
