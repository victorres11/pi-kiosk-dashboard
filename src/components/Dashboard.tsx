import {
  WeatherWidget,
  SportsWidget,
  ClockWidget,
  NewsWidget,
  CalendarWidget,
} from './widgets';
import './Dashboard.css';

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Top row: Clock takes prominence */}
        <div className="grid-item clock-area">
          <ClockWidget />
        </div>

        {/* Weather widget - large, left side */}
        <div className="grid-item weather-area">
          <WeatherWidget />
        </div>

        {/* Sports widget - right side */}
        <div className="grid-item sports-area">
          <SportsWidget />
        </div>

        {/* Bottom row: Placeholder widgets */}
        <div className="grid-item news-area">
          <NewsWidget />
        </div>

        <div className="grid-item calendar-area">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
}
