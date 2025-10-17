import { NextRequest, NextResponse } from "next/server";
import {
  fetchStockQuote,
  fetchMultipleQuotes,
  fetchMarketIndices,
  fetchChartData,
} from "@/lib/stockApi";

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
        return NextResponse.json(quote);

      case "multiple":
        if (!symbols) {
          return NextResponse.json(
            { error: "Symbols are required" },
            { status: 400 }
          );
        }
        const symbolArray = symbols.split(",");
        const quotes = await fetchMultipleQuotes(symbolArray);
        return NextResponse.json(quotes);

      case "indices":
        const indices = await fetchMarketIndices();
        return NextResponse.json(indices);

      case "chart":
        if (!symbol) {
          return NextResponse.json(
            { error: "Symbol is required" },
            { status: 400 }
          );
        }
        const interval = searchParams.get("interval") || "5min";
        const chartData = await fetchChartData(symbol, interval);
        return NextResponse.json(chartData);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
