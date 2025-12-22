# Pi Kiosk Dashboard

A React-based dashboard for Raspberry Pi kiosk displays. Shows real-time weather, college sports scores, time, and customizable widgets.

## Features

- **Weather Widget** - Current conditions, feels like, 5-day forecast with temperature chart
- **Sports Widget** - Live college football and basketball scores from ESPN
- **Clock Widget** - Large, readable time and date display
- **News Widget** - Placeholder for news headlines (customizable)
- **Calendar Widget** - Placeholder for calendar events (customizable)

### Design Features

- Dark theme optimized for 24/7 display
- Large fonts readable from 6-10 feet away
- Responsive grid layout for various screen sizes
- Smooth animations on data updates
- Auto-refresh with configurable intervals
- Error handling with fallback to last good data
- "Last updated" timestamps on all widgets

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd pi-kiosk-dashboard
npm install
```

### 2. Configure API Keys

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Required: Get your free API key at https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Optional: Customize location (defaults to Scottsdale, AZ)
VITE_WEATHER_CITY=Scottsdale
VITE_WEATHER_STATE=AZ
VITE_WEATHER_COUNTRY=US

# Optional: Refresh intervals in minutes
VITE_WEATHER_REFRESH_INTERVAL=10
VITE_SPORTS_REFRESH_INTERVAL=5

# Optional: Show/hide widgets
VITE_SHOW_WEATHER=true
VITE_SHOW_SPORTS=true
VITE_SHOW_CLOCK=true
VITE_SHOW_NEWS=true
VITE_SHOW_CALENDAR=true
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 to see the dashboard.

### 4. Build for Production

```bash
npm run build
npm run preview  # Test production build locally
```

## Raspberry Pi Setup

### Prerequisites

- Raspberry Pi 5 (or 4) with Raspberry Pi OS
- Display connected via HDMI
- Network connection (WiFi or Ethernet)

### Automated Setup

Copy the project to your Pi, then run:

```bash
cd pi-kiosk-dashboard
chmod +x scripts/setup-kiosk.sh
./scripts/setup-kiosk.sh
```

This will:
- Install required packages (Chromium, unclutter, etc.)
- Configure auto-start kiosk mode
- Set up a systemd service for the web server

### Manual Setup

1. **Build the dashboard on your Pi:**
   ```bash
   npm install
   npm run build
   ```

2. **Install a simple HTTP server:**
   ```bash
   npm install -g serve
   ```

3. **Start the server:**
   ```bash
   serve -s dist -l 8080
   ```

4. **Configure Chromium kiosk mode:**
   Add to `~/.config/openbox/autostart` or equivalent:
   ```bash
   chromium-browser --kiosk --noerrdialogs http://localhost:8080
   ```

### Disable Screen Blanking

Add to your autostart script:
```bash
xset s off
xset s noblank
xset -dpms
```

## Configuration

### Refresh Intervals

Configure in `.env` or `src/config/dashboard.config.ts`:

| Widget | Default | Environment Variable |
|--------|---------|---------------------|
| Weather | 10 min | `VITE_WEATHER_REFRESH_INTERVAL` |
| Sports | 5 min | `VITE_SPORTS_REFRESH_INTERVAL` |
| News | 15 min | `VITE_NEWS_REFRESH_INTERVAL` |
| Clock | 1 sec | (not configurable) |

### Widget Visibility

Toggle widgets on/off via environment variables:

```env
VITE_SHOW_WEATHER=true
VITE_SHOW_SPORTS=true
VITE_SHOW_CLOCK=true
VITE_SHOW_NEWS=false  # Hide news widget
VITE_SHOW_CALENDAR=false  # Hide calendar widget
```

### Customize Sports Teams

Edit `src/config/dashboard.config.ts` to follow specific teams:

```typescript
sportsTeams: {
  collegefootball: [
    { id: '333', name: 'Alabama' },
    { id: '251', name: 'Arizona State' },
    // Add your teams...
  ],
  collegebasketball: [
    { id: '12', name: 'Arizona' },
    // Add your teams...
  ],
}
```

Find team IDs at ESPN's website URLs (e.g., `/team/_/id/333/alabama-crimson-tide`).

## Customizing Placeholder Widgets

### News Widget

Edit `src/components/widgets/NewsWidget.tsx` to integrate your preferred news source:

- [NewsAPI](https://newsapi.org/) - Free tier available
- RSS feeds - Use a library like `rss-parser`
- Custom API endpoints

### Calendar Widget

Edit `src/components/widgets/CalendarWidget.tsx` to integrate:

- [Google Calendar API](https://developers.google.com/calendar)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/outlook-calendar-concept-overview)
- iCal feeds

## API Information

### OpenWeatherMap (Required for Weather)

1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Get your free API key from the dashboard
3. Free tier: 1,000 calls/day (plenty for 10-minute refreshes)

### ESPN API (No key required)

The sports widget uses ESPN's public scoreboard endpoints. No API key needed, but be mindful of rate limits.

## Troubleshooting

### Weather not loading
- Verify your API key in `.env`
- Check the browser console for errors
- Ensure you've waited a few minutes after creating your API key (activation delay)

### Sports scores not showing
- Scores only appear during active game days
- Off-season will show "No games scheduled"

### Dashboard not auto-starting on Pi
- Check that the systemd service is enabled: `sudo systemctl status pi-kiosk-dashboard`
- Verify Chromium is installed: `which chromium-browser`
- Check autostart permissions: `ls -la ~/.config/openbox/autostart`

### Screen going blank
- Ensure screen blanking is disabled (see setup script)
- Check power management settings in Raspberry Pi Configuration

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Recharts** - Temperature chart
- **date-fns** - Date formatting
- **Axios** - API requests
- **Lucide React** - Icons

## License

MIT License - Feel free to customize and use for your own kiosk projects!
