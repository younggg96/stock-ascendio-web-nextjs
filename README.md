# Stock Ascendio Web

A modern stock market analysis and tracking platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🎯 Landing Page (Home)

- 💚 Beautiful animated grid background
- ✨ Glowing border effect on email input focus
- 📧 Email signup form for early access
- 🌙 Dark theme with custom green accent (#53d22d)
- 📱 Fully responsive design
- 🎨 Material Symbols icons integration

### 📊 Dashboard (/dashboard)

- 🎯 Professional trading interface with sidebar navigation
- 📈 Market indices cards (Dow Jones, NASDAQ, S&P 500)
- 📊 Interactive Chart.js charts with multiple timeframes (1D, 1W, 1M, 1Y, ALL)
- 👀 "My Watchlist" with real-time price updates
- 📰 "Market News" section with latest updates
- 🎨 Dark theme optimized for trading (#0D110D background)
- ⚡ Fast performance with Next.js App Router
- 🔍 Stock search functionality
- 📱 Fully responsive design

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Chart.js
- **Icons:** Material Symbols Outlined
- **Fonts:** Manrope (Google Fonts)

## Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
# Create production build
npm run build
# or
yarn build
# or
pnpm build
```

### Production

```bash
# Start production server
npm start
# or
yarn start
# or
pnpm start
```

## Project Structure

```
stock-ascendio-web-nextjs/
├── app/                     # Next.js App Router pages
│   ├── dashboard/           # Stock dashboard route
│   │   └── page.tsx        # Dashboard page
│   ├── layout.tsx          # Root layout with dark mode
│   ├── page.tsx            # Email signup landing page
│   └── globals.css         # Global styles with animations
├── components/                  # React components
│   ├── EmailSignup.tsx          # Email signup form component
│   ├── Sidebar.tsx              # Vertical navigation sidebar
│   ├── MarketIndex.tsx          # Market index card component
│   ├── StockChartWithControls.tsx # Chart with timeframe controls
│   ├── Watchlist.tsx            # Stock watchlist component
│   ├── MarketNews.tsx           # Market news component
│   ├── Header.tsx               # Header component (legacy)
│   ├── StockCard.tsx            # Stock card component (legacy)
│   └── StockChart.tsx           # Chart component (legacy)
├── lib/                    # Utility functions
│   └── utils.ts           # Helper utilities
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration (extended)
└── tsconfig.json          # TypeScript configuration
```

## Routes

- `/` - Email signup landing page with animated background
- `/dashboard` - Stock market dashboard with charts and cards

## License

MIT
