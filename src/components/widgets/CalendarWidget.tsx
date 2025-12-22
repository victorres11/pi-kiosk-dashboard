import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import type { CalendarEvent } from '../../types';
import './CalendarWidget.css';

// Mock calendar data - replace with Google Calendar API or other integration
const generateMockEvents = (): CalendarEvent[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Team Standup',
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30),
      allDay: false,
    },
    {
      id: '2',
      title: 'Project Review',
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
      allDay: false,
    },
    {
      id: '3',
      title: 'Doctor Appointment',
      startTime: addDays(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30), 1),
      allDay: false,
    },
    {
      id: '4',
      title: 'Weekend BBQ',
      startTime: addDays(new Date(now.getFullYear(), now.getMonth(), now.getDate()), 3),
      allDay: true,
    },
  ];
};

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Simulate API fetch - replace with actual calendar API
    const fetchEvents = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setEvents(generateMockEvents());
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchEvents();
    // Refresh every 15 minutes
    const interval = setInterval(fetchEvents, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!config.widgets.calendar) return null;

  const groupedEvents = groupEventsByDay(events);

  return (
    <WidgetContainer
      title="Calendar"
      icon={<Calendar size={24} />}
      loading={loading}
      lastUpdated={lastUpdated}
      className="calendar-widget"
    >
      <div className="calendar-events">
        {Object.entries(groupedEvents).map(([dayKey, dayEvents]) => (
          <div key={dayKey} className="calendar-day-group">
            <h4 className="calendar-day-header">{dayKey}</h4>
            {dayEvents.map((event) => (
              <div key={event.id} className="calendar-event">
                <div className="event-time">
                  {event.allDay ? (
                    <span className="all-day-badge">All Day</span>
                  ) : (
                    format(event.startTime, 'h:mm a')
                  )}
                </div>
                <div className="event-details">
                  <span className="event-title">{event.title}</span>
                  {event.endTime && !event.allDay && (
                    <span className="event-duration">
                      {format(event.endTime, 'h:mm a')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {events.length === 0 && !loading && (
          <div className="no-events">
            <p>No upcoming events</p>
          </div>
        )}
      </div>

      <div className="widget-placeholder-note">
        <p>Connect your Google Calendar or other calendar service</p>
        <p>Edit CalendarWidget.tsx to integrate your preferred API</p>
      </div>
    </WidgetContainer>
  );
}

function groupEventsByDay(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  const grouped: Record<string, CalendarEvent[]> = {};

  events.forEach((event) => {
    let dayKey: string;
    if (isToday(event.startTime)) {
      dayKey = 'Today';
    } else if (isTomorrow(event.startTime)) {
      dayKey = 'Tomorrow';
    } else {
      dayKey = format(event.startTime, 'EEEE, MMM d');
    }

    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }
    grouped[dayKey].push(event);
  });

  return grouped;
}
