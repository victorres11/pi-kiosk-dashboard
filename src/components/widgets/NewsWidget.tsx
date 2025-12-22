import { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import './NewsWidget.css';

interface NewsStory {
  id: string;
  title: string;
  snippet: string;
  source: string;
  category: string;
  publishedAt: Date;
}

const ROTATION_INTERVAL = 8000; // 8 seconds per story

// Mock news data - replace with actual API integration
const mockNews: NewsStory[] = [
  {
    id: '1',
    title: 'College Football Playoff Bracket Revealed',
    snippet: 'The CFP committee has announced the final 12-team bracket for this season. Top seeds include Georgia, Michigan, and Florida State, setting up potential blockbuster matchups in the quarterfinals.',
    source: 'ESPN',
    category: 'Football',
    publishedAt: new Date(),
  },
  {
    id: '2',
    title: 'March Madness Early Predictions',
    snippet: 'Basketball analysts are already projecting top seeds for the upcoming tournament. Duke, Kansas, and UConn lead early projections, while several mid-majors are poised to make deep runs.',
    source: 'CBS Sports',
    category: 'Basketball',
    publishedAt: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    title: 'Conference Realignment Updates',
    snippet: 'The latest round of conference realignment continues to reshape college athletics. The ACC and Big 12 are actively discussing expansion options as schools seek long-term stability.',
    source: 'The Athletic',
    category: 'College Sports',
    publishedAt: new Date(Date.now() - 7200000),
  },
  {
    id: '4',
    title: 'Transfer Portal Window Opens',
    snippet: 'Student-athletes across all sports can now enter the transfer portal. Early reports suggest record numbers of players exploring new opportunities ahead of next season.',
    source: 'Sports Illustrated',
    category: 'Recruiting',
    publishedAt: new Date(Date.now() - 10800000),
  },
  {
    id: '5',
    title: 'NIL Deals Reshaping Recruiting',
    snippet: 'Name, Image, and Likeness agreements continue to transform how top programs attract talent. Industry experts estimate top recruits are signing deals worth over $1 million annually.',
    source: 'Yahoo Sports',
    category: 'Business',
    publishedAt: new Date(Date.now() - 14400000),
  },
];

export function NewsWidget() {
  const [news, setNews] = useState<NewsStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Simulate API fetch - replace with actual API call
    const fetchNews = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setNews(mockNews);
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchNews();
    const interval = setInterval(fetchNews, config.refreshIntervals.news);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate through stories
  useEffect(() => {
    if (news.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [news.length]);

  if (!config.widgets.news) return null;

  const currentStory = news[currentIndex];

  return (
    <WidgetContainer
      title="News"
      icon={<Newspaper size={18} />}
      loading={loading}
      lastUpdated={lastUpdated}
      className="news-widget"
    >
      {news.length > 0 && currentStory && (
        <div className="news-rotator">
          <div className="news-story" key={currentStory.id}>
            <div className="story-header">
              <span className="story-category">{currentStory.category}</span>
              <span className="story-time">
                {formatDistanceToNow(currentStory.publishedAt, { addSuffix: true })}
              </span>
            </div>

            <h3 className="story-title">{currentStory.title}</h3>

            <p className="story-snippet">{currentStory.snippet}</p>

            <div className="story-footer">
              <span className="story-source">{currentStory.source}</span>
            </div>
          </div>

          <div className="news-progress">
            {news.map((_, idx) => (
              <button
                key={idx}
                className={`progress-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to story ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {news.length === 0 && !loading && (
        <div className="news-empty">
          <p>No news available</p>
        </div>
      )}
    </WidgetContainer>
  );
}
