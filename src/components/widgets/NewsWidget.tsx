import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import type { NewsItem } from '../../types';
import './NewsWidget.css';

// Mock news data - replace with actual API integration
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'College Football Playoff Bracket Revealed',
    source: 'ESPN',
    url: '#',
    publishedAt: new Date(),
  },
  {
    id: '2',
    title: 'March Madness Predictions: Top Seeds to Watch',
    source: 'CBS Sports',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    title: 'Breaking: Major Conference Realignment News',
    source: 'The Athletic',
    url: '#',
    publishedAt: new Date(Date.now() - 7200000),
  },
  {
    id: '4',
    title: 'Weekend Sports Preview: Key Matchups',
    source: 'Sports Illustrated',
    url: '#',
    publishedAt: new Date(Date.now() - 10800000),
  },
];

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Simulate API fetch - replace with actual API call
    const fetchNews = async () => {
      setLoading(true);
      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setNews(mockNews);
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchNews();
    const interval = setInterval(fetchNews, config.refreshIntervals.news);
    return () => clearInterval(interval);
  }, []);

  if (!config.widgets.news) return null;

  return (
    <WidgetContainer
      title="News Headlines"
      icon={<Newspaper size={24} />}
      loading={loading}
      lastUpdated={lastUpdated}
      className="news-widget"
    >
      <div className="news-list">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="news-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="news-content">
              <h4 className="news-title">{item.title}</h4>
              <div className="news-meta">
                <span className="news-source">{item.source}</span>
                <span className="news-time">
                  {format(item.publishedAt, 'h:mm a')}
                </span>
              </div>
            </div>
            <ExternalLink size={16} className="news-link-icon" />
          </a>
        ))}
      </div>
      <div className="widget-placeholder-note">
        <p>Replace mock data with your preferred news API</p>
        <p>Suggestions: NewsAPI, RSS feeds, or custom sources</p>
      </div>
    </WidgetContainer>
  );
}
