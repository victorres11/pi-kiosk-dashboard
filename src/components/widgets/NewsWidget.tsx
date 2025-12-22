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
  imageUrl?: string;
}

interface ESPNImage {
  url: string;
  width: number;
  height: number;
}

interface ESPNCategory {
  description?: string;
  type?: string;
}

interface ESPNArticle {
  id: string;
  headline: string;
  description: string;
  published: string;
  images?: ESPNImage[];
  categories?: ESPNCategory[];
}

interface ESPNResponse {
  articles?: ESPNArticle[];
}

const ROTATION_INTERVAL = 8000; // 8 seconds per story

// ESPN news endpoints for different sports
const ESPN_NEWS_ENDPOINTS = [
  'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news',
  'https://site.api.espn.com/apis/site/v2/sports/football/college-football/news',
  'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news',
];

const fetchESPNNews = async (): Promise<NewsStory[]> => {
  try {
    // Fetch from multiple ESPN endpoints
    const responses = await Promise.all(
      ESPN_NEWS_ENDPOINTS.map((url) =>
        fetch(url)
          .then((res) => res.json())
          .catch(() => ({ articles: [] }))
      )
    );

    const allArticles: NewsStory[] = [];

    responses.forEach((data: ESPNResponse, index) => {
      const sportLabels = ['NFL', 'CFB', 'NBA'];
      const articles = data.articles || [];

      articles.slice(0, 3).forEach((article: ESPNArticle) => {
        // Find best image (prefer wider images for our layout)
        const image = article.images?.find((img) => img.width >= 400) || article.images?.[0];

        // Get category from article
        const category =
          article.categories?.find((c) => c.type === 'league')?.description || sportLabels[index];

        allArticles.push({
          id: article.id,
          title: article.headline,
          snippet: article.description,
          source: 'ESPN',
          category: category,
          publishedAt: new Date(article.published),
          imageUrl: image?.url,
        });
      });
    });

    // Sort by publish date and return top stories
    return allArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, 8);
  } catch (error) {
    console.error('Error fetching ESPN news:', error);
    return [];
  }
};

export function NewsWidget() {
  const [news, setNews] = useState<NewsStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const stories = await fetchESPNNews();
      setNews(stories);
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
      title="Sports News"
      icon={<Newspaper size={18} />}
      loading={loading}
      lastUpdated={lastUpdated}
      className="news-widget"
    >
      {news.length > 0 && currentStory && (
        <div className="news-rotator">
          <div className="news-story" key={currentStory.id}>
            <div className="story-layout">
              {currentStory.imageUrl && (
                <div className="story-image-container">
                  <img
                    src={currentStory.imageUrl}
                    alt={currentStory.title}
                    className="story-image"
                  />
                </div>
              )}

              <div className="story-content">
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
