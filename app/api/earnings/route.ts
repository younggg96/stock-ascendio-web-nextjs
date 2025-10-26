import { NextRequest, NextResponse } from "next/server";
import { fetchEarningsCalendar, fetchSymbolEarnings } from "@/lib/earningsApi";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    if (symbol) {
      // Fetch earnings for specific symbol
      const earnings = await fetchSymbolEarnings(symbol);
      return NextResponse.json(earnings);
    } else {
      // Fetch earnings calendar with optional date range
      const earnings = await fetchEarningsCalendar(
        from || undefined,
        to || undefined
      );
      return NextResponse.json(earnings);
    }
  } catch (error) {
    console.error("Earnings API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings data" },
      { status: 500 }
    );
  }
}

