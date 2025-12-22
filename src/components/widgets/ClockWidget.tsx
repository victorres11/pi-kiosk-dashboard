import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import './ClockWidget.css';

export function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, config.refreshIntervals.clock);

    return () => clearInterval(interval);
  }, []);

  if (!config.widgets.clock) return null;

  return (
    <WidgetContainer
      title="Time"
      icon={<Clock size={24} />}
      className="clock-widget"
      minimal
    >
      <div className="clock-content">
        <div className="clock-time">
          <span className="clock-hours">{format(time, 'h')}</span>
          <span className="clock-separator">:</span>
          <span className="clock-minutes">{format(time, 'mm')}</span>
          <span className="clock-period">{format(time, 'a')}</span>
        </div>
        <div className="clock-date">
          <span className="clock-day">{format(time, 'EEEE')}</span>
          <span className="clock-full-date">{format(time, 'MMMM d, yyyy')}</span>
        </div>
      </div>
    </WidgetContainer>
  );
}
