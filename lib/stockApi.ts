// Stock API Service
// Using multiple free APIs for redundancy and better data coverage

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
  previousClose?: number;
  marketCap?: number;
  timestamp?: string;
}

export interface MarketIndex {
  name: string;
  value: string;
  change: number;
  changePercent: number;
}

export interface ChartData {
  time: string;
  value: number;
}

// Yahoo Finance API (unofficial but reliable)
const YAHOO_BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart";

// Alternative: Twelve Data API (free tier available)
const TWELVE_DATA_BASE_URL = "https://api.twelvedata.com";

// Alpha Vantage API (requires free API key)
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";
const ALPHA_VANTAGE_API_KEY =
  process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "demo";

// Finnhub API (requires free API key)
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";

// Stock symbols mapping
const STOCK_NAMES: Record<string, string> = {
  AAPL: "Apple Inc.",
  GOOGL: "Alphabet Inc.",
  MSFT: "Microsoft Corp.",
  TSLA: "Tesla, Inc.",
  AMZN: "Amazon.com, Inc.",
  NVDA: "NVIDIA Corp.",
  META: "Meta Platforms, Inc.",
  NFLX: "Netflix, Inc.",
};

// Market indices mapping
const INDEX_SYMBOLS: Record<string, string> = {
  "Dow Jones": "^DJI",
  NASDAQ: "^IXIC",
  "S&P 500": "^GSPC",
};

/**
 * Fetch stock quote using Yahoo Finance API
 */
async function fetchYahooQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const url = `${YAHOO_BASE_URL}/${symbol}?interval=1d&range=1d`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Yahoo API returned ${response.status} for ${symbol}`);
      return null;
    }

    const data = await response.json();

    if (!data.chart?.result?.[0]?.meta) {
      console.warn(`Invalid Yahoo API response for ${symbol}`);
      return null;
    }

    const quote = data.chart.result[0].meta;
    const price = quote.regularMarketPrice || quote.chartPreviousClose;
    const previousClose = quote.previousClose || quote.chartPreviousClose;

    if (!price || !previousClose) {
      console.warn(`Missing price data from Yahoo for ${symbol}`);
      return null;
    }

    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      symbol: symbol,
      name: STOCK_NAMES[symbol] || quote.longName || symbol,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: quote.regularMarketVolume,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      previousClose,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching Yahoo quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch stock quote using Alpha Vantage API
 */
async function fetchAlphaVantageQuote(
  symbol: string
): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    const quote = data["Global Quote"];

    if (!quote || Object.keys(quote).length === 0) return null;

    const price = parseFloat(quote["05. price"]);
    const change = parseFloat(quote["09. change"]);
    const changePercent = parseFloat(
      quote["10. change percent"].replace("%", "")
    );

    return {
      symbol: symbol,
      name: STOCK_NAMES[symbol] || symbol,
      price,
      change,
      changePercent,
      volume: parseInt(quote["06. volume"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      previousClose: parseFloat(quote["08. previous close"]),
      timestamp: quote["07. latest trading day"],
    };
  } catch (error) {
    console.error(`Error fetching Alpha Vantage quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch stock quote using Finnhub API
 */
async function fetchFinnhubQuote(symbol: string): Promise<StockQuote | null> {
  if (!FINNHUB_API_KEY) return null;

  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    if (!response.ok) return null;

    const data = await response.json();

    return {
      symbol: symbol,
      name: STOCK_NAMES[symbol] || symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      previousClose: data.pc,
      timestamp: new Date(data.t * 1000).toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching Finnhub quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get mock data as fallback
 */
function getMockQuote(symbol: string): StockQuote {
  const mockData: Record<string, StockQuote> = {
    AAPL: {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 178.25,
      change: 2.35,
      changePercent: 1.34,
    },
    GOOGL: {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 170.29,
      change: -0.98,
      changePercent: -0.57,
    },
    MSFT: {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 420.72,
      change: 5.16,
      changePercent: 1.24,
    },
    TSLA: {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      price: 175.79,
      change: -1.89,
      changePercent: -1.06,
    },
    AMZN: {
      symbol: "AMZN",
      name: "Amazon.com, Inc.",
      price: 185.07,
      change: 2.1,
      changePercent: 1.15,
    },
    NVDA: {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 875.28,
      change: 12.45,
      changePercent: 1.44,
    },
  };

  return (
    mockData[symbol] || {
      symbol,
      name: STOCK_NAMES[symbol] || symbol,
      price: 100 + Math.random() * 500,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
    }
  );
}

/**
 * Main function to fetch stock quote with fallbacks
 */
export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  console.log(`📊 Fetching data for ${symbol}...`);

  // Try Yahoo Finance first (no API key required)
  let quote = await fetchYahooQuote(symbol);
  if (quote) {
    console.log(`✅ Successfully fetched ${symbol} from Yahoo Finance`);
    return quote;
  }

  // Fallback to Alpha Vantage if Yahoo fails
  if (ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY !== "demo") {
    console.log(`🔄 Trying Alpha Vantage for ${symbol}...`);
    quote = await fetchAlphaVantageQuote(symbol);
    if (quote) {
      console.log(`✅ Successfully fetched ${symbol} from Alpha Vantage`);
      return quote;
    }
  }

  // Fallback to Finnhub if both fail
  if (FINNHUB_API_KEY) {
    console.log(`🔄 Trying Finnhub for ${symbol}...`);
    quote = await fetchFinnhubQuote(symbol);
    if (quote) {
      console.log(`✅ Successfully fetched ${symbol} from Finnhub`);
      return quote;
    }
  }

  // Use mock data as last resort
  console.warn(
    `⚠️ Using mock data for ${symbol} - Configure API keys for real data`
  );
  console.warn(`📝 See STOCK_API_SETUP.md for instructions`);
  quote = getMockQuote(symbol);

  return quote;
}

/**
 * Fetch multiple stock quotes
 */
export async function fetchMultipleQuotes(
  symbols: string[]
): Promise<StockQuote[]> {
  const promises = symbols.map((symbol) => fetchStockQuote(symbol));
  return Promise.all(promises);
}

/**
 * Fetch market indices
 */
export async function fetchMarketIndices(): Promise<MarketIndex[]> {
  const indices = Object.entries(INDEX_SYMBOLS);
  const promises = indices.map(async ([name, symbol]) => {
    const quote = await fetchStockQuote(symbol);
    return {
      name,
      value: quote.price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      change: quote.change,
      changePercent: quote.changePercent,
    };
  });

  return Promise.all(promises);
}

/**
 * Fetch intraday chart data
 */
export async function fetchChartData(
  symbol: string,
  interval: string = "5min"
): Promise<ChartData[]> {
  // Generate mock intraday data for now
  // In production, use Alpha Vantage TIME_SERIES_INTRADAY or Yahoo Finance API
  const data: ChartData[] = [];
  const basePrice = 170;
  const times = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  times.forEach((time, index) => {
    data.push({
      time,
      value: basePrice + Math.sin(index * 0.5) * 5 + Math.random() * 2,
    });
  });

  return data;
}
