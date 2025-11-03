import { NextRequest, NextResponse } from "next/server";
import {
  fetchStockQuote,
  fetchMultipleQuotes,
  fetchMarketIndices,
  fetchChartData,
} from "@/lib/stockApi";

// Enable runtime edge for faster responses
export const runtime = "nodejs";

// Revalidate data every 60 seconds
export const revalidate = 60;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const symbol = searchParams.get("symbol");
  const symbols = searchParams.get("symbols");

  try {
    switch (action) {
      case "quote":
        if (!symbol) {
          return NextResponse.json(
            { error: "Symbol is required" },
            { status: 400 }
          );
        }
        const quote = await fetchStockQuote(symbol);
        return NextResponse.json(quote, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        });

      case "multiple":
        if (!symbols) {
          return NextResponse.json(
            { error: "Symbols are required" },
            { status: 400 }
          );
        }
        const symbolArray = symbols.split(",");
        const quotes = await fetchMultipleQuotes(symbolArray);
        return NextResponse.json(quotes, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        });

      case "indices":
        console.log("Fetching real-time market indices...");
        const indices = await fetchMarketIndices();
        console.log("Market indices fetched:", indices);

        if (!indices || indices.length === 0) {
          throw new Error("No market indices data available");
        }

        return NextResponse.json(indices, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        });

      case "chart":
        if (!symbol) {
          return NextResponse.json(
            { error: "Symbol is required" },
            { status: 400 }
          );
        }
        const interval = searchParams.get("interval") || "5min";
        const chartData = await fetchChartData(symbol, interval);
        return NextResponse.json(chartData, {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          },
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Stock API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch stock data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
