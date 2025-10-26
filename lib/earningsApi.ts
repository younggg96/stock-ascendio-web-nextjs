// Earnings Calendar API Service
// Using multiple APIs for earnings calendar data

export interface EarningsEvent {
  date: string;
  symbol: string;
  companyName: string;
  epsEstimate?: number | null;
  epsActual?: number | null;
  revenueEstimate?: number | null;
  revenueActual?: number | null;
  quarter?: number;
  year?: number;
  time?: 'bmo' | 'amc' | 'dmh'; // before market open, after market close, during market hours
  fiscalYear?: number;
  fiscalQuarter?: number;
  logo?: string | null;
  industry?: string | null;
  marketCap?: number | null;
}

export interface CompanyProfile {
  logo: string;
  name: string;
  ticker: string;
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  phone: string;
  shareOutstanding: number;
  weburl: string;
  finnhubIndustry: string;
}

// API Keys from environment
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "demo";
const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY || "";

// API Base URLs
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";
const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

// Cache for company profiles
const companyProfileCache = new Map<string, CompanyProfile | null>();

// Stock names mapping (can be expanded)
const STOCK_NAMES: Record<string, string> = {
  AAPL: "Apple Inc.",
  GOOGL: "Alphabet Inc.",
  GOOG: "Alphabet Inc.",
  MSFT: "Microsoft Corp.",
  TSLA: "Tesla, Inc.",
  AMZN: "Amazon.com, Inc.",
  NVDA: "NVIDIA Corp.",
  META: "Meta Platforms, Inc.",
  NFLX: "Netflix, Inc.",
  AMD: "Advanced Micro Devices",
  INTC: "Intel Corp.",
  CSCO: "Cisco Systems",
  ORCL: "Oracle Corp.",
  IBM: "IBM",
  CRM: "Salesforce",
  ADBE: "Adobe Inc.",
  PYPL: "PayPal Holdings",
  V: "Visa Inc.",
  MA: "Mastercard Inc.",
  DIS: "Walt Disney Co.",
  BA: "Boeing Co.",
  GE: "General Electric",
  JPM: "JPMorgan Chase",
  BAC: "Bank of America",
  WFC: "Wells Fargo",
  GS: "Goldman Sachs",
  MS: "Morgan Stanley",
  C: "Citigroup Inc.",
};

/**
 * Fetch company profile from Finnhub
 */
export async function fetchCompanyProfile(
  symbol: string
): Promise<CompanyProfile | null> {
  // Check cache first
  if (companyProfileCache.has(symbol)) {
    return companyProfileCache.get(symbol) || null;
  }

  if (!FINNHUB_API_KEY) {
    console.warn("⚠️ Finnhub API key not configured");
    return null;
  }

  try {
    const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url, { 
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      console.warn(`Finnhub profile API returned ${response.status} for ${symbol}`);
      companyProfileCache.set(symbol, null);
      return null;
    }

    const data = await response.json();

    if (!data || !data.name) {
      console.warn(`No profile data for ${symbol}`);
      companyProfileCache.set(symbol, null);
      return null;
    }

    const profile: CompanyProfile = {
      logo: data.logo || "",
      name: data.name || symbol,
      ticker: data.ticker || symbol,
      country: data.country || "",
      currency: data.currency || "USD",
      exchange: data.exchange || "",
      ipo: data.ipo || "",
      marketCapitalization: data.marketCapitalization || 0,
      phone: data.phone || "",
      shareOutstanding: data.shareOutstanding || 0,
      weburl: data.weburl || "",
      finnhubIndustry: data.finnhubIndustry || "",
    };

    // Cache the result
    companyProfileCache.set(symbol, profile);
    return profile;
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error);
    companyProfileCache.set(symbol, null);
    return null;
  }
}

/**
 * Fetch earnings calendar from Finnhub
 */
async function fetchFinnhubEarnings(
  from: string,
  to: string
): Promise<EarningsEvent[] | null> {
  if (!FINNHUB_API_KEY) {
    console.warn("⚠️ Finnhub API key not configured");
    return null;
  }

  try {
    const url = `${FINNHUB_BASE_URL}/calendar/earnings?from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url, { 
      cache: "no-store",
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`Finnhub API returned ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.earningsCalendar || data.earningsCalendar.length === 0) {
      console.warn("No earnings data from Finnhub");
      return null;
    }

    return data.earningsCalendar.map((item: any) => ({
      date: item.date,
      symbol: item.symbol,
      companyName: STOCK_NAMES[item.symbol] || item.symbol,
      epsEstimate: item.epsEstimate,
      epsActual: item.epsActual,
      revenueEstimate: item.revenueEstimate,
      revenueActual: item.revenueActual,
      quarter: item.quarter,
      year: item.year,
    }));
  } catch (error) {
    console.error("Error fetching Finnhub earnings:", error);
    return null;
  }
}

/**
 * Fetch earnings calendar from Alpha Vantage
 */
async function fetchAlphaVantageEarnings(
  symbol?: string
): Promise<EarningsEvent[] | null> {
  if (!ALPHA_VANTAGE_API_KEY || ALPHA_VANTAGE_API_KEY === "demo") {
    console.warn("⚠️ Alpha Vantage API key not configured");
    return null;
  }

  try {
    let url = `${ALPHA_VANTAGE_BASE_URL}?function=EARNINGS_CALENDAR&apikey=${ALPHA_VANTAGE_API_KEY}`;
    if (symbol) {
      url += `&symbol=${symbol}`;
    }

    const response = await fetch(url, { 
      cache: "no-store",
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.warn(`Alpha Vantage API returned ${response.status}`);
      return null;
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    if (lines.length < 2) {
      console.warn("No earnings data from Alpha Vantage");
      return null;
    }

    // Parse CSV (skip header)
    const events: EarningsEvent[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const [sym, name, reportDate, fiscalDateEnding, estimate, currency] = line.split(',');
      
      if (sym && reportDate) {
        events.push({
          date: reportDate,
          symbol: sym,
          companyName: name || STOCK_NAMES[sym] || sym,
          epsEstimate: estimate ? parseFloat(estimate) : null,
          fiscalYear: fiscalDateEnding ? new Date(fiscalDateEnding).getFullYear() : undefined,
        });
      }
    }

    return events;
  } catch (error) {
    console.error("Error fetching Alpha Vantage earnings:", error);
    return null;
  }
}

/**
 * Fetch earnings calendar from Financial Modeling Prep
 */
async function fetchFMPEarnings(
  from: string,
  to: string
): Promise<EarningsEvent[] | null> {
  if (!FMP_API_KEY) {
    console.warn("⚠️ FMP API key not configured");
    return null;
  }

  try {
    const url = `${FMP_BASE_URL}/earning_calendar?from=${from}&to=${to}&apikey=${FMP_API_KEY}`;
    const response = await fetch(url, { 
      cache: "no-store",
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.warn(`FMP API returned ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn("No earnings data from FMP");
      return null;
    }

    return data.map((item: any) => ({
      date: item.date,
      symbol: item.symbol,
      companyName: STOCK_NAMES[item.symbol] || item.symbol,
      epsEstimate: item.epsEstimated,
      epsActual: item.eps,
      revenueEstimate: item.revenueEstimated,
      revenueActual: item.revenue,
      time: item.time,
      fiscalYear: item.fiscalDateEnding ? new Date(item.fiscalDateEnding).getFullYear() : undefined,
    }));
  } catch (error) {
    console.error("Error fetching FMP earnings:", error);
    return null;
  }
}

/**
 * Generate mock earnings data as fallback
 */
function getMockEarningsData(from: string, to: string): EarningsEvent[] {
  const startDate = new Date(from);
  const endDate = new Date(to);
  const events: EarningsEvent[] = [];
  
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
  const timeSlots: Array<'bmo' | 'amc' | 'dmh'> = ['bmo', 'amc', 'dmh'];
  
  // Generate events for each day in range
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Random 1-3 companies per day
    const numEvents = Math.floor(Math.random() * 3) + 1;
    const selectedSymbols = symbols
      .sort(() => Math.random() - 0.5)
      .slice(0, numEvents);
    
    selectedSymbols.forEach(symbol => {
      events.push({
        date: d.toISOString().split('T')[0],
        symbol,
        companyName: STOCK_NAMES[symbol] || symbol,
        epsEstimate: parseFloat((Math.random() * 5).toFixed(2)),
        epsActual: null,
        revenueEstimate: Math.floor(Math.random() * 100000000000),
        revenueActual: null,
        quarter: Math.floor(Math.random() * 4) + 1,
        year: d.getFullYear(),
        time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
      });
    });
  }
  
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Delay helper for rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Enrich earnings events with company profiles
 */
async function enrichEarningsWithProfiles(
  earnings: EarningsEvent[]
): Promise<EarningsEvent[]> {
  // Get unique symbols
  const symbols = [...new Set(earnings.map(e => e.symbol))];
  
  // Limit to top 20 companies to avoid rate limiting
  const limitedSymbols = symbols.slice(0, 20);
  
  console.log(`🔄 Fetching profiles for ${limitedSymbols.length} companies...`);
  
  // Fetch profiles sequentially with delay to avoid rate limiting
  for (const symbol of limitedSymbols) {
    await fetchCompanyProfile(symbol);
    // Add 200ms delay between requests to avoid 429 errors
    await delay(200);
  }

  // Enrich earnings with profile data
  return earnings.map(event => {
    const profile = companyProfileCache.get(event.symbol);
    if (profile) {
      return {
        ...event,
        logo: profile.logo,
        industry: profile.finnhubIndustry,
        marketCap: profile.marketCapitalization,
        companyName: profile.name || event.companyName,
      };
    }
    return event;
  });
}

/**
 * Main function to fetch earnings calendar with fallbacks
 */
export async function fetchEarningsCalendar(
  from?: string,
  to?: string,
  enrichWithProfiles: boolean = true
): Promise<EarningsEvent[]> {
  // Default to next 7 days if not specified
  const today = new Date();
  const defaultFrom = from || today.toISOString().split('T')[0];
  
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 7);
  const defaultTo = to || endDate.toISOString().split('T')[0];

  console.log(`📊 Fetching earnings calendar from ${defaultFrom} to ${defaultTo}...`);

  // Try Finnhub first
  let earnings = await fetchFinnhubEarnings(defaultFrom, defaultTo);
  if (earnings && earnings.length > 0) {
    console.log(`✅ Successfully fetched ${earnings.length} earnings events from Finnhub`);
    
    // Enrich with company profiles if requested
    if (enrichWithProfiles && FINNHUB_API_KEY) {
      console.log(`🔄 Enriching earnings with company profiles...`);
      earnings = await enrichEarningsWithProfiles(earnings);
      console.log(`✅ Enriched earnings with company info`);
    }
    
    return earnings;
  }

  // Fallback to FMP
  if (FMP_API_KEY) {
    console.log(`🔄 Trying FMP for earnings calendar...`);
    earnings = await fetchFMPEarnings(defaultFrom, defaultTo);
    if (earnings && earnings.length > 0) {
      console.log(`✅ Successfully fetched ${earnings.length} earnings events from FMP`);
      
      if (enrichWithProfiles && FINNHUB_API_KEY) {
        earnings = await enrichEarningsWithProfiles(earnings);
      }
      
      return earnings;
    }
  }

  // Fallback to Alpha Vantage (without date range)
  if (ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY !== "demo") {
    console.log(`🔄 Trying Alpha Vantage for earnings calendar...`);
    earnings = await fetchAlphaVantageEarnings();
    if (earnings && earnings.length > 0) {
      // Filter by date range
      const filtered = earnings.filter(e => e.date >= defaultFrom && e.date <= defaultTo);
      if (filtered.length > 0) {
        console.log(`✅ Successfully fetched ${filtered.length} earnings events from Alpha Vantage`);
        
        if (enrichWithProfiles && FINNHUB_API_KEY) {
          return await enrichEarningsWithProfiles(filtered);
        }
        
        return filtered;
      }
    }
  }

  // Use mock data as last resort
  console.warn(`⚠️ Using mock earnings data - Configure API keys for real data`);
  return getMockEarningsData(defaultFrom, defaultTo);
}

/**
 * Fetch earnings for specific symbol
 */
export async function fetchSymbolEarnings(symbol: string): Promise<EarningsEvent[]> {
  console.log(`📊 Fetching earnings for ${symbol}...`);

  // Try Alpha Vantage for symbol-specific data
  if (ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY !== "demo") {
    const earnings = await fetchAlphaVantageEarnings(symbol);
    if (earnings && earnings.length > 0) {
      console.log(`✅ Successfully fetched earnings for ${symbol}`);
      return earnings;
    }
  }

  // Fallback to general calendar and filter
  const allEarnings = await fetchEarningsCalendar();
  return allEarnings.filter(e => e.symbol === symbol);
}

/**
 * Group earnings by date
 */
export function groupEarningsByDate(events: EarningsEvent[]): Record<string, EarningsEvent[]> {
  return events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, EarningsEvent[]>);
}

/**
 * Format earnings date for display
 */
export function formatEarningsDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const earningsDate = new Date(date);
  earningsDate.setHours(0, 0, 0, 0);
  
  const diffTime = earningsDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get earnings time label
 */
export function getEarningsTimeLabel(time?: 'bmo' | 'amc' | 'dmh'): string {
  switch (time) {
    case 'bmo':
      return 'Before Market Open';
    case 'amc':
      return 'After Market Close';
    case 'dmh':
      return 'During Market Hours';
    default:
      return 'TBD';
  }
}

