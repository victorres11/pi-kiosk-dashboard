# Pi Kiosk Dashboard

A React-based kiosk dashboard designed for Raspberry Pi displays. Features live sports scores, weather, news, crypto prices, and more with a glassmorphic dark theme optimized for 24/7 display.

## Features

### Widgets
- **Clock Widget** - Large, readable time and date display
- **Weather Widget** - Current conditions, hourly/daily forecast with temperature chart
- **Crypto Widget** - Live prices for BTC, ETH, XRP, FARTCOIN (rotates with weather)
- **49ers Countdown** - Next game countdown with live scores during games
- **News Widget** - Rotating sports news from ESPN (NFL, CFB, NBA)
- **CFP Bracket Widget** - College Football Playoff bracket standings
- **Sports Ticker** - Scrolling NFL and college football scores
- **Message Banner** - Customizable announcement banner

### Special Features
- **Screen Takeover** - Every 2 minutes, displays full-screen content:
  - Inspirational quotes
  - Random GIFs
  - "Did You Know?" facts
  - "This Day in History" events
  - Jim Harbaugh moments
- **Live Game Updates** - 49ers widget shows real-time scores during games
- **Auto-refresh** - All widgets refresh at configurable intervals
- **Error Resilience** - Falls back to last good data on API failures

## Tech Stack

- React 18 + TypeScript
- Vite
- Recharts (weather charts)
- Axios (API calls)
- Lucide React (icons)
- CSS with glassmorphic dark theme

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required: OpenWeatherMap API Key
# Get free at https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Location settings
VITE_WEATHER_CITY=Scottsdale
VITE_WEATHER_STATE=AZ
VITE_WEATHER_COUNTRY=US

# Refresh intervals (in minutes, except where noted)
VITE_WEATHER_REFRESH_INTERVAL=10
VITE_SPORTS_REFRESH_INTERVAL=5
VITE_NEWS_REFRESH_INTERVAL=15
VITE_CRYPTO_REFRESH_INTERVAL=2

# Widget visibility (true/false)
VITE_SHOW_WEATHER=true
VITE_SHOW_SPORTS=true
VITE_SHOW_CLOCK=true
VITE_SHOW_NEWS=true
VITE_SHOW_CALENDAR=true
VITE_SHOW_NETWORK=false

# Network monitoring (optional, requires backend server)
VITE_NETWORK_API_URL=http://localhost:3001
VITE_NETWORK_REFRESH_INTERVAL=10
VITE_NETWORK_TOP_DEVICES=5
```

## Project Structure

```
pi-kiosk-dashboard/
├── src/
│   ├── components/
│   │   ├── widgets/              # All dashboard widgets
│   │   │   ├── ClockWidget.tsx
│   │   │   ├── WeatherWidget.tsx
│   │   │   ├── CryptoWidget.tsx
│   │   │   ├── WeatherCryptoWidget.tsx   # Rotates between weather/crypto
│   │   │   ├── CountdownWidget.tsx       # 49ers countdown + live scores
│   │   │   ├── NewsWidget.tsx
│   │   │   ├── SportsWidget.tsx          # Scrolling ticker
│   │   │   ├── CFPBracketWidget.tsx
│   │   │   ├── NetworkWidget.tsx         # Hidden, for future use
│   │   │   ├── MessageBanner.tsx
│   │   │   └── WidgetContainer.tsx       # Base wrapper component
│   │   ├── Dashboard.tsx         # Main layout
│   │   ├── Dashboard.css         # Grid layout styles
│   │   ├── ScreenTakeover.tsx    # Full-screen takeover feature
│   │   └── ScreenTakeover.css
│   ├── hooks/
│   │   └── useDataFetcher.ts     # Generic data fetching hook with polling
│   ├── utils/
│   │   └── api.ts                # API functions (weather, sports, crypto)
│   ├── config/
│   │   └── dashboard.config.ts   # Centralized configuration
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── assets/                   # Images and logos
├── backend/                      # Network monitoring server (optional)
│   ├── server.js
│   └── package.json
└── public/
```

## APIs Used

| API | Purpose | Auth Required |
|-----|---------|---------------|
| [OpenWeatherMap](https://openweathermap.org/api) | Weather data | Yes (free tier: 1,000 calls/day) |
| ESPN | Sports scores, news, 49ers live data | No |
| [CoinGecko](https://www.coingecko.com/en/api) | Crypto prices | No |
| [Giphy](https://developers.giphy.com/) | GIFs for screen takeover | No (public beta key) |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Raspberry Pi Kiosk Setup

The Pi runs Chromium in kiosk mode pointing to your Vercel URL.

**Example kiosk script** (`/home/pi/kiosk.sh`):
```bash
#!/bin/bash
# Disable screen blanking
xset s noblank
xset s off
xset -dpms

# Hide cursor
unclutter -idle 0.5 -root &

# Launch Chromium in kiosk mode
chromium-browser \
  --noerrdialogs \
  --disable-infobars \
  --kiosk \
  https://your-app.vercel.app
```

**Auto-start on boot** - Add to `~/.config/lxsession/LXDE-pi/autostart`:
```
@bash /home/pi/kiosk.sh
```

## Network Monitoring (Future Feature)

The dashboard includes a Network Bandwidth Widget that's currently hidden. It requires a backend server on your Pi and router-level access for accurate per-device monitoring.

### Backend Setup (on Raspberry Pi)

```bash
# Install vnStat for bandwidth monitoring
sudo apt update
sudo apt install vnstat -y
sudo systemctl start vnstat

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repo and run backend
git clone https://github.com/YOUR_USERNAME/pi-kiosk-dashboard.git
cd pi-kiosk-dashboard/backend
npm install
npm start

# For production, use PM2
sudo npm install -g pm2
pm2 start server.js --name network-monitor
pm2 startup
pm2 save
```

**Note:** The Pi can only monitor traffic on its own interface. For full network monitoring, you'd need router-level access (UniFi, pfSense, etc.) or the Pi acting as a network gateway.

## Customization

### Changing the 49ers to Another Team

Edit `src/components/widgets/CountdownWidget.tsx`:
- Update `teamLogos` object with your team's ESPN logo URL
- Update `fallbackSchedule` with your team's games
- Change the ESPN team ID in `fetchLiveGameData()`

### Changing Crypto Coins

Edit `src/config/dashboard.config.ts`:
```typescript
crypto: {
  coins: [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    // Add/remove coins (use CoinGecko IDs)
  ],
}
```

### Adding Screen Takeover Content

Edit `src/components/ScreenTakeover.tsx`:
- `quotes` array - Inspirational quotes
- `didYouKnowFacts` array - Fun facts
- `thisDayInHistory` object - Historical events by date
- `harbaughQuotes` array - Jim Harbaugh quotes

### Adding a New Widget

1. Create `src/components/widgets/YourWidget.tsx`
2. Create `src/components/widgets/YourWidget.css`
3. Export from `src/components/widgets/index.ts`
4. Add to `Dashboard.tsx` layout
5. Add grid area in `Dashboard.css`

## Development

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Troubleshooting

### Weather not loading
- Verify your `VITE_OPENWEATHER_API_KEY` in `.env`
- New API keys take a few minutes to activate
- Check browser console for errors

### 49ers scores showing 0-0 during live game
- The widget uses ESPN's scoreboard API which updates every 30 seconds
- If issues persist, check browser console for API errors

### Screen takeover shows blank
- Usually a Giphy API rate limit; it falls back to quotes automatically

### Crypto prices not loading
- CoinGecko has rate limits; the widget retries automatically

## License

MIT License - Feel free to customize for your own kiosk projects!
