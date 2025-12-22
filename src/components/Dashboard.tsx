import {
  WeatherWidget,
  SportsWidget,
  ClockWidget,
  NewsWidget,
  CFPBracketWidget,
  MessageBanner,
} from './widgets';
import './Dashboard.css';

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Message banner at top */}
        <div className="grid-item message-area">
          <MessageBanner />
        </div>

        {/* Clock row */}
        <div className="grid-item clock-area">
          <ClockWidget />
        </div>

        {/* Middle row: Main widgets */}
        <div className="grid-item weather-area">
          <WeatherWidget />
        </div>

        <div className="grid-item news-area">
          <NewsWidget />
        </div>

        <div className="grid-item bracket-area">
          <CFPBracketWidget />
        </div>

        {/* Bottom: Sports ticker full width */}
        <div className="grid-item sports-area">
          <SportsWidget />
        </div>
      </div>
    </div>
  );
}
